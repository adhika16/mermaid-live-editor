import json
import os

import resend


def _load_payload(req, log):
    """Extract request payload as a dict if available."""

    def _as_dict(value):
        if isinstance(value, dict):
            return value
        if isinstance(value, str) and value.strip():
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                log("Request body is not valid JSON; ignoring string payload.")
        return {}

    body = _as_dict(getattr(req, "body", None))
    if body:
        return body
    return _as_dict(getattr(req, "body_raw", None))


def _send_welcome_email(user_data, resend_api_key, default_from, log, error):
    """Send a welcome email to a newly created user."""
    # Handle both direct user data and nested user object
    if isinstance(user_data, dict):
        # Check if user_data has nested user info (from event payload)
        user_email = user_data.get("email")
        user_name = user_data.get("name")
        user_id = user_data.get("$id") or user_data.get("userId")
    else:
        log("Invalid user data format")
        return {"status": "failed", "error": "invalid_user_data"}
    
    # Extract name from email if not provided
    if not user_name and user_email:
        user_name = user_email.split("@")[0]
    elif not user_name:
        user_name = "User"
    
    if not user_email:
        log("User created without email, skipping welcome email")
        return {"status": "skipped", "reason": "no_email"}
    
    log(f"Preparing welcome email for user: {user_email} (ID: {user_id})")
    
    # Retrieve the Mermaid Live Editor URL from environment variable, with a fallback
    mermaid_url = os.environ.get("MERMAID_LIVE_URL", "https://mermaid-live-editor.appwrite.network")
    
    # Welcome email template
    subject = "Welcome to Mermaid Live Editor!"
    html_content = f"""
    <html>
    <body>
        <h2>Welcome to Mermaid Live Editor, {user_name}!</h2>
        <p>Thank you for joining our community. You can now:</p>
        <ul>
            <li>Create beautiful diagrams with Mermaid syntax</li>
            <li>Share your diagrams with others</li>
            <li>Export your work in various formats</li>
        </ul>
        <p>Get started by visiting the <a href="{mermaid_url}">Mermaid Live Editor</a>.</p>
        <p>Happy diagramming!</p>
        <br>
        <p>Best regards,<br>The Mermaid Live Editor Team</p>
    </body>
    </html>
    """
    
    email_params = {
        "from": default_from,
        "to": [user_email],
        "subject": subject,
        "html": html_content,
    }
    
    try:
        response = resend.Emails.send(email_params)
        log(f"Welcome email sent to {user_email}: {response.get('id')}")
        return {
            "status": "sent",
            "id": response.get("id"),
            "to": user_email,
            "user_id": user_id
        }
    except Exception as err:
        error(f"Failed to send welcome email to {user_email}: {repr(err)}")
        return {
            "status": "failed",
            "error": str(err),
            "user_email": user_email
        }


def _handle_user_creation_event(payload, resend_api_key, default_from, log, error):
    """Handle user creation events and send welcome emails."""
    # For event-triggered functions, the payload is directly the user object
    # No need to check for 'events' field - just validate it's a user object
    
    # Validate that we have user data (check for required fields like $id and email)
    if not payload or not isinstance(payload, dict):
        log("Invalid or missing user data")
        return {"status": "failed", "error": "invalid_user_data"}
    
    if not payload.get("$id") or not payload.get("email"):
        log("Payload does not appear to be a user object (missing $id or email)")
        return {"status": "not_user_creation", "reason": "missing_user_fields"}
    
    return _send_welcome_email(payload, resend_api_key, default_from, log, error)


def main(context):
    if context.req.path == "/ping":
        return context.res.text("Pong")

    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        context.error("Missing RESEND_API_KEY environment variable.")
        return context.res.json({"error": "Email service is not configured."})

    resend.api_key = api_key
    default_from = os.environ.get("RESEND_DEFAULT_FROM")
    
    if not default_from:
        context.error("Missing RESEND_DEFAULT_FROM environment variable.")
        return context.res.json({"error": "Default sender email not configured."})

    # Load and log the raw payload for debugging
    payload = _load_payload(context.req, context.log)

    # Check if this is an Appwrite user creation event (payload contains user data directly)
    # Event-triggered functions receive the user object directly, not wrapped in events
    if payload and isinstance(payload, dict) and payload.get("$id") and payload.get("email"):
        context.log("Detected user creation event (direct user payload)")
        result = _handle_user_creation_event(
            payload, api_key, default_from, context.log, context.error
        )
        context.log(f"Event processing result: {json.dumps(result, indent=2)}")
        return context.res.json(result)

    # Original email sending functionality (for manual HTTP requests)
    sender = payload.get("from") or default_from
    recipients = payload.get("to")
    subject = payload.get("subject")
    html_body = payload.get("html")
    text_body = payload.get("text")

    missing_fields = [
        field
        for field, value in (
            ("from", sender),
            ("to", recipients),
            ("subject", subject),
        )
        if not value
    ]
    if missing_fields:
        return context.res.json(
            {
                "error": "Missing required fields.",
                "details": {
                    "required": ["from", "to", "subject"],
                    "missing": missing_fields,
                },
            }
        )

    if isinstance(recipients, str):
        recipients = [recipients]
    if not isinstance(recipients, list) or not all(isinstance(item, str) for item in recipients):
        return context.res.json(
            {"error": "Field 'to' must be a string or a list of strings."}
        )

    if not html_body and not text_body:
        return context.res.json(
            {"error": "Provide either 'html' or 'text' content for the email."}
        )

    email_params = {
        "from": sender,
        "to": recipients,
        "subject": subject,
    }
    if html_body:
        email_params["html"] = html_body
    if text_body:
        email_params["text"] = text_body

    try:
        response = resend.Emails.send(email_params)
        context.log(f"Email sent via Resend: {response.get('id')}")
    except Exception as err:
        context.error(f"Failed to send email: {repr(err)}")
        return context.res.json({"error": "Failed to send email."})

    return context.res.json(
        {
            "id": response.get("id"),
            "to": response.get("to", recipients),
            "subject": response.get("subject", subject),
            "status": response.get("status"),
        }
    )