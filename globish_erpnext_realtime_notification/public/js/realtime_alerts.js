
// Make sure frappe and frappe.realtime are available
// This script will be loaded after the main Frappe assets

// Wait for Frappe to be fully initialized, especially frappe.realtime
frappe.dom.ready(() => {
    if (frappe && frappe.realtime) {
        console.log("Globish Realtime: Listening for 'show_custom_globish_alert'");

        frappe.realtime.on('show_custom_globish_alert', function(data) {
            // 'data' here is the 'message' (alert_payload) sent from frappe.publish_realtime
            console.log("Globish Realtime: Received 'show_custom_globish_alert'", data);

            if (data && data.message) {
                frappe.show_alert({
                    message: __(data.message), // Use __() for translatable strings
                    indicator: data.indicator || 'green', // Default to green if not provided
                    // title: data.title ? __(data.title) : undefined // Optional title
                }, data.duration || 5); // Default to 5 seconds if not provided
            } else {
                console.error("Globish Realtime: Received 'show_custom_globish_alert' without proper data:", data);
            }
        });
    } else {
        console.error("Globish Realtime: frappe.realtime not available.");
    }
});
