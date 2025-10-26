# email-processor

## 🧰 Usage

### GET /ping

- Returns a "Pong" message.

**Response**

Sample `200` Response:

```text
Pong
```

### POST /

- Sends an email through Resend using request-provided parameters.

**Request Body**

```json
{
  "from": "sender@example.com",
  "to": ["recipient@example.com"],
  "subject": "Hello World",
  "html": "<strong>It works!</strong>",
  "text": "It works!" // optional if html is provided
}
```

**Response**

Sample `200` Response:

```json
{
  "id": "123",
  "to": ["recipient@example.com"],
  "subject": "Hello World",
  "status": "sent"
}
```

## ⚙️ Configuration

| Setting           | Value                             |
| ----------------- | --------------------------------- |
| Runtime           | Python (3.9)                      |
| Entrypoint        | `src/main.py`                     |
| Build Commands    | `pip install -r requirements.txt` |
| Permissions       | `any`                             |
| Timeout (Seconds) | 15                                |

## 🔒 Environment Variables

| Name                   | Description                               |
| ---------------------- | ----------------------------------------- |
| `RESEND_API_KEY`       | API key for the Resend account.           |
| `RESEND_DEFAULT_FROM`* | Optional default sender address fallback. |


`*` Optional.
