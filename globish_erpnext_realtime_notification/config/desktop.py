from frappe import _

def get_data():
    return [
        {
            "module_name": "Globish ERPNext Realtime Notification", # This should match app_title
            "color": "#FFC107", # Example color, choose one
            "icon": "octicon octicon-puzzle", # Example icon, choose from https://octicons.github.com/
            "type": "module",
            "label": _("Globish ERPNext Realtime Notification") # This is the translatable label shown on Desk
        }
    ]