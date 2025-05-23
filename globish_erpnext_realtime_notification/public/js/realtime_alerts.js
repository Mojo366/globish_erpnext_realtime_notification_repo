document.addEventListener('DOMContentLoaded', function() {
    function setupRealtimeListener() {
        // Check if all necessary Frappe objects and functions are available
        if (
            window.frappe &&
            window.frappe.session && // Wait for frappe.session
            window.frappe.session.user && // Crucially, wait for frappe.session.user to be populated
            window.frappe.realtime &&
            typeof window.frappe.realtime.on === 'function' &&
            // window.frappe.realtime.socket && // Let's make socket optional for the main listener, but check for low-level
            typeof window.frappe.show_alert === 'function' &&
            typeof window.__ === 'function'
        ) {
            console.log("Globish Realtime: Client is ready. Listening for 'show_custom_globish_alert' for user:", frappe.session.user);
            console.log("Globish Realtime: frappe.realtime object:", frappe.realtime);
            console.log("Globish Realtime: typeof frappe.realtime.on:", typeof frappe.realtime.on);
            console.log("Globish Realtime: frappe.realtime.socket object:", frappe.realtime.socket); // Now it might be defined

            // Test 1: Your specific event (Primary)
            frappe.realtime.on('show_custom_globish_alert', function(data) {
                console.log("Globish Realtime: Received 'show_custom_globish_alert' EVENT! Data:", data);
                if (data && data.message) {
                    frappe.show_alert({
                        message: __(data.message),
                        indicator: data.indicator || 'green',
                    }, data.duration || 5);
                } else {
                     console.error("Globish Realtime: Received 'show_custom_globish_alert' but data or message missing.", data);
                }
            });

            // Test 2: Generic 'notification' event
            frappe.realtime.on('notification', function(data) {
                console.log("Globish Realtime: Received generic 'notification' EVENT! Data:", data);
            });

            // Test 3: Low-level socket listener (if socket is now available)
            if (frappe.realtime.socket && typeof frappe.realtime.socket.on === 'function') {
                console.log("Globish Realtime: Attempting to attach to LOW-LEVEL socket.");
                frappe.realtime.socket.on('show_custom_globish_alert', function(eventDataFromServer) {
                    console.log("Globish Realtime: LOW-LEVEL SOCKET received 'show_custom_globish_alert' EVENT! Data:", eventDataFromServer);
                    let data = eventDataFromServer; // Assuming payload is directly passed
                    if (data && data.message) {
                        frappe.show_alert({
                            message: __("LOW-LEVEL: " + data.message),
                            indicator: data.indicator || 'orange',
                        }, data.duration || 7);
                    }
                });

                // const namespacedEvent = `/globish-sandbox.frappe.cloud,show_custom_globish_alert`;
                // frappe.realtime.socket.on(namespacedEvent, function(eventDataFromServer) {
                //      console.log("Globish Realtime: LOW-LEVEL SOCKET received NAMESPACED '"+namespacedEvent+"' EVENT! Data:", eventDataFromServer);
                // });

            } else {
                console.warn("Globish Realtime: frappe.realtime.socket or socket.on not available for low-level test (even after waiting).");
            }

        } else {
            // Log which specific part is missing for easier debugging
            let missing = [];
            if (!window.frappe) missing.push("window.frappe");
            else {
                if (!window.frappe.session) missing.push("window.frappe.session");
                else if (!window.frappe.session.user) missing.push("window.frappe.session.user (it's undefined or empty)");
                if (!window.frappe.realtime) missing.push("window.frappe.realtime");
                else if (typeof window.frappe.realtime.on !== 'function') missing.push("window.frappe.realtime.on (function)");
                // else if (!window.frappe.realtime.socket) missing.push("window.frappe.realtime.socket (for low-level test)"); // Socket check can be deferred
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
