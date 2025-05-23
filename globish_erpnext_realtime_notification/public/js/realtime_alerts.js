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
            // Inside setupRealtimeListener, after the 'if (window.frappe && ...)' block

            console.log("Globish Realtime: Client is ready. Listening for 'show_custom_globish_alert' for user:", frappe.session.user);
            console.log("Globish Realtime: frappe.realtime object:", frappe.realtime); // Log the object
            console.log("Globish Realtime: typeof frappe.realtime.on:", typeof frappe.realtime.on); // Should be 'function'
            console.log("Globish Realtime: frappe.realtime.socket object:", frappe.realtime.socket); // Log the underlying socket.io instance

            // Test 1: Your specific event
            frappe.realtime.on('show_custom_globish_alert', function(data) {
                console.log("Globish Realtime: Received 'show_custom_globish_alert' EVENT! Data:", data);
                // ... your alert logic
                if (data && data.message) {
                    frappe.show_alert({
                        message: __(data.message),
                        indicator: data.indicator || 'green',
                    }, data.duration || 5);
                }
            });

            // Test 2: Listen to a known Frappe internal event that happens on user activity
            // For example, 'user_activity' if that exists, or something related to notifications
            // Let's try listening to the raw 'notification' event that you saw in the WS frames.
            // This is the second event you saw: 42/globish-sandbox.frappe.cloud,["notification",{}]
            frappe.realtime.on('notification', function(data) {
                console.log("Globish Realtime: Received generic 'notification' EVENT! Data:", data);
                // DO NOT PUT YOUR CUSTOM ALERT LOGIC HERE, this is just to see if the 'on' works
            });

            // Test 3: If frappe.realtime.socket is available, try attaching directly to it (more low-level)
            // This bypasses some of Frappe's abstractions.
            if (frappe.realtime.socket && typeof frappe.realtime.socket.on === 'function') {
                frappe.realtime.socket.on('show_custom_globish_alert', function(eventDataFromServer) {
                    // Note: The data format might be different here, it might be just the payload,
                    // or it might be an array like [eventName, payload] if the server emits it that way to the raw socket.
                    // The `42/prefix, [eventName, payload]` format suggests the server might emit `eventName` with `payload`.
                    console.log("Globish Realtime: LOW-LEVEL SOCKET received 'show_custom_globish_alert' EVENT! Data:", eventDataFromServer);

                    // Check if eventDataFromServer is directly your payload or needs parsing
                    let data = eventDataFromServer;
                    // If it's an array like [eventName, payload] from the server emit, and eventName here is the same,
                    // then data might be eventDataFromServer[1] or eventDataFromServer itself if socket.io unwraps it.
                    // Based on `42/prefix,[eventName,payload]`, socket.io client's `socket.on(eventName, callback)`
                    // usually gives `payload` directly to the callback.

                    if (data && data.message) { // Assuming 'data' here is your payload object
                        frappe.show_alert({
                            message: __("LOW-LEVEL: " + data.message), // Prefix to distinguish
                            indicator: data.indicator || 'orange', // Different color
                        }, data.duration || 7); // Different duration
                    }
                });

                // Also try listening to the namespaced event on the raw socket, just in case
                const namespacedEvent = `/globish-sandbox.frappe.cloud,show_custom_globish_alert`;
                frappe.realtime.socket.on(namespacedEvent, function(eventDataFromServer) {
                    console.log("Globish Realtime: LOW-LEVEL SOCKET received NAMESPACED '"+namespacedEvent+"' EVENT! Data:", eventDataFromServer);
                });


            } else {
                console.warn("Globish Realtime: frappe.realtime.socket or socket.on not available for low-level test.");
            }



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
