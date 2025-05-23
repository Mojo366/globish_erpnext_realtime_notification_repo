import frappe

def handle_new_notification_log(doc, method):
    """
    This function is called when a Notification Log document is updated (which includes creation).
    'doc' is the Notification Log document instance.
    'method' is the string representing the event (e.g., "on_update").
    """
    frappe.log_error(title="Custom App Log", message=f"Handling Notification Log: {doc.name} for User: {doc.for_user}, Method: {method}")

    if doc.for_user:
        try:
            # Prepare the payload for frappe.show_alert
            alert_payload = {
                'message': doc.subject or "You have a new notification", # Default message if subject is empty
                'indicator': 'green', # 'green', 'blue', 'orange', 'red'
                # 'title': "Notification Title" # Optional title for the alert
            }
            # Duration for the alert (in seconds)
            alert_duration = 15

            # Publish a custom event. The 'message' here will be received as 'data' by the client-side handler.
            # We'll also send the duration separately or include it in the payload.
            # Let's include it in the payload for cleaner client-side code.
            alert_payload['duration'] = alert_duration

            frappe.publish_realtime(
                event='show_custom_globish_alert', # A unique event name for your app
                message=alert_payload,
                user=doc.for_user
            )
            frappe.log_error(title="Custom App Log", message=f"Published show_custom_globish_alert for {doc.for_user} with payload: {alert_payload}")

        except Exception as e:
            frappe.log_error(title="Custom App Realtime Error", message=str(e))
    else:
        frappe.log_error(title="Custom App Log", message="Notification Log does not have 'for_user' set, not sending realtime alert.")


@frappe.whitelist()
def get_unread_notification_count_for_user(): # Renamed for clarity
    """
    Returns the count of unread Notification Log entries for the current session user.
    """
    if not frappe.session.user:
        return 0
    
    count = frappe.db.count('Notification Log', {
        'for_user': frappe.session.user,
        'read': 0
    })
    return count
