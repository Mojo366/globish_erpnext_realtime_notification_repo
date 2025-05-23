document.addEventListener('DOMContentLoaded', function() {
    function setupRealtimeListener() {
        if (
            window.frappe &&
            window.frappe.session &&
            window.frappe.session.user &&
            window.frappe.realtime &&
            typeof window.frappe.realtime.on === 'function' &&
            typeof window.frappe.show_alert === 'function' &&
            typeof window.frappe.call === 'function' &&
            typeof window.__ === 'function'
        ) {
            fetchAndShowUnreadNotificationsSummary(); // Call this first

            console.log("Globish Realtime: Client ready. Listening for NEW 'show_custom_globish_alert' for user:", frappe.session.user);
            frappe.realtime.on('show_custom_globish_alert', function(data) {
                console.log("Globish Realtime: Received NEW 'show_custom_globish_alert' EVENT. Payload:", data);
                if (data && data.message) {
                    frappe.show_alert({
                        message: __(data.message),
                        indicator: data.indicator || 'green',
                    }, data.duration || 5);
                } else {
                     console.error("Globish Realtime: Received NEW 'show_custom_globish_alert' but payload data or message missing.", data);
                }
            });

        } else {
            let missing = [];
            if (!window.frappe) missing.push("window.frappe");
            else {
                if (!window.frappe.session) missing.push("window.frappe.session");
                else if (!window.frappe.session.user) missing.push("window.frappe.session.user");
                if (!window.frappe.realtime) missing.push("window.frappe.realtime");
                else if (typeof window.frappe.realtime.on !== 'function') missing.push("window.frappe.realtime.on");
                if (typeof window.frappe.call !== 'function') missing.push("window.frappe.call");
                if (typeof window.frappe.show_alert !== 'function') missing.push("window.frappe.show_alert");
                if (typeof window.__ !== 'function') missing.push("window.__");
            }
            console.warn(`Globish Realtime: Waiting for Frappe dependencies (missing: ${missing.join(', ')}). Retrying in 500ms...`);
            setTimeout(setupRealtimeListener, 500);
        }
    }

    function fetchAndShowUnreadNotificationsSummary() {
           console.log("Globish Realtime: Checking for initially unread notifications for user:", frappe.session.user);
           frappe.call({
               method: "globish_erpnext_realtime_notification.utils.get_unread_notification_count_for_user",
               callback: function(r) {
                   if (r && typeof r.message !== 'undefined') {
                       let unread_count = parseInt(r.message);
                       console.log("Globish Realtime: Initial unread notification count:", unread_count);
                       if (unread_count > 0) {
                           // Use JavaScript template literal for string construction
                           // and wrap the whole thing with __() for translation if the entire phrase needs it.
                           // If only parts are translatable, __() would be used on those parts.
                           // For "{X} unread notifications", often "unread notifications" is the part to translate.

                           let message_text;
                           if (unread_count === 1) {
                               message_text = `${unread_count} ${__("unread notification")}`;
                           } else {
                               message_text = `${unread_count} ${__("unread notifications")}`;
                           }
                           // Or simpler if you don't need to translate "unread notification(s)" separately:
                           // message_text = __(`${unread_count} unread notification(s)`);


                           frappe.show_alert({
                               message: message_text,
                               indicator: 'orange',
                           }, 15);
                       }
                   } else {
                       console.error("Globish Realtime: Failed to fetch initial unread notification count or no count returned.", r);
                   }
               },
               error: function(err) {
                   console.error("Globish Realtime: Error fetching initial unread notification count:", err);
               }
           });
       }

    setupRealtimeListener();
});
