document.addEventListener('DOMContentLoaded', function() {
    // This function will try to set up the listener.
    // If Frappe's necessary parts aren't ready, it will schedule itself to try again.
    function setupRealtimeListener() {
        // Check if all necessary Frappe objects and functions are available
        if (
            window.frappe &&
            window.frappe.realtime &&
            typeof window.frappe.realtime.on === 'function' &&
            typeof window.frappe.show_alert === 'function' &&
            typeof window.__ === 'function' // For translations __()
        ) {
            console.log("Globish Realtime: All Frappe dependencies (realtime, show_alert, __) are ready. Listening for 'show_custom_globish_alert'.");
			const eventNameToListen = 'show_custom_globish_alert'
            frappe.realtime.on(eventNameToListen, function(data) {
                console.log("Globish Realtime: Received 'show_custom_globish_alert' with data:", data);

                if (data && data.message) {
                    frappe.show_alert({
                        message: __(data.message), // Use __() for translatable strings
                        indicator: data.indicator || 'green', // Default to green if not provided
                        // title: data.title ? __(data.title) : undefined // Optional title
                    }, data.duration || 5); // Default to 5 seconds if not provided
                } else {
                    console.error("Globish Realtime: Received 'show_custom_globish_alert' but 'data' or 'data.message' is missing.", data);
                }
            });

        } else {
            // Log which specific part is missing for easier debugging if issues persist
            let missing = [];
            if (!window.frappe) missing.push("window.frappe");
            else {
                if (!window.frappe.realtime) missing.push("window.frappe.realtime");
                else if (typeof window.frappe.realtime.on !== 'function') missing.push("window.frappe.realtime.on (function)");
                if (typeof window.frappe.show_alert !== 'function') missing.push("window.frappe.show_alert (function)");
                if (typeof window.__ !== 'function') missing.push("window.__ (translation function)");
            }

            console.warn(`Globish Realtime: Frappe dependencies not yet fully available (missing: ${missing.join(', ')}). Retrying in 500ms...`);
            setTimeout(setupRealtimeListener, 500); // Retry after 500ms
        }
    }

    // Initial call to try setting up the listener
    setupRealtimeListener();
});
