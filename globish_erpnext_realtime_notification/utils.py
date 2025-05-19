# my_custom_app/my_custom_app/utils.py

import frappe

def handle_new_notification_log(doc, method):
    """
    This function is called when a Notification Log document is updated (which includes creation).
    'doc' is the Notification Log document instance.
    'method' is the string representing the event (e.g., "on_update").
    """
    # frappe.log_error(title="Debug New Notification", message=f"Notification Log: {doc.name}, User: {doc.for_user}, Method: {method}")

    # Check if the document is new (has not been saved before)
    # This is a common check for 'on_update' to only act on creation or specific changes.
    # For Notification Log, 'on_update' fires on creation itself.
    # You might add more specific conditions if needed, e.g., based on doc.type or doc.subject
    frappe.log_error('my custom app works!')
    if doc.for_user: # Ensure there's a user to send the notification to
        try:
            frappe.publish_realtime(event='msgprint',message=doc.subject,user=doc.for_user);
        except Exception as e:
            frappe.log_error('except error')
    else:
        frappe.log_error('if doc.for_user not true...')

# If you chose "after_insert" hook instead:
# def handle_new_notification_log_insert(doc, method):
#     # This function is called only after a new Notification Log is inserted.
#     if doc.for_user:
#         frappe.publish_realtime(event='msgprint', message="New notification (from after_insert)!", user=doc.for_user)
#     else:
#         frappe.log_error(title="Notification Log Issue", message=f"Notification Log {doc.name} has no for_user.")
