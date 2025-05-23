document.addEventListener('DOMContentLoaded', function() {
    function setupRealtimeListener() {
        // Check if all necessary Frappe objects and functions are available
        if (
            window.frappe &&
            window.frappe.session &&
            window.frappe.session.user && // Crucially, wait for frappe.session.user
            window.frappe.realtime &&
            typeof window.frappe.realtime.on === 'function' &&
            typeof window.frappe.show_alert === 'function' &&
            typeof window.__ === 'function'
        ) {
            console.log("Globish Realtime: Client ready. Listening for 'show_custom_globish_alert' for user:", frappe.session.user);

            // Primary listener - This is the one you want to keep
            frappe.realtime.on('show_custom_globish_alert', function(data) {
                console.log("Globish Realtime: Received 'show_custom_globish_alert' EVENT. Payload:", data);
                if (data && data.message) {
                    frappe.show_alert({
                        message: __(data.message), // Ensure translation works
                        indicator: data.indicator || 'blue',
                        // title: data.title ? __(data.title) : undefined // Optional: if you add title in payload
                    }, data.duration || 10); // Default duration if not provided
                } else {
                     console.error("Globish Realtime: Received 'show_custom_globish_alert' but payload data or message missing.", data);
                }
            });

            // OPTIONAL: You can remove the generic 'notification' listener if it was just for debugging
            // frappe.realtime.on('notification', function(data) {
            //     console.log("Globish Realtime: Received generic 'notification' EVENT! Data:", data);
            // });

        } else {
            let missing = [];
            if (!window.frappe) missing.push("window.frappe");
            else {
                if (!window.frappe.session) missing.push("window.frappe.session");
                else if (!window.frappe.session.user) missing.push("window.frappe.session.user");
                if (!window.frappe.realtime) missing.push("window.frappe.realtime");
                else if (typeof window.frappe.realtime.on !== 'function') missing.push("window.frappe.realtime.on");
                if (typeof window.frappe.show_alert !== 'function') missing.push("window.frappe.show_alert");
                if (typeof window.__ !== 'function') missing.push("window.__");
            }
            console.warn(`Globish Realtime: Waiting for Frappe dependencies (missing: ${missing.join(', ')}). Retrying in 500ms...`);
            setTimeout(setupRealtimeListener, 500);
        }
    }
    setupRealtimeListener();
});
