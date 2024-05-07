paypal.Buttons({
    style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
    },
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '0.01'
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            document.getElementById('payment-message').style.display = 'block';
            document.getElementById('payment-message').className = 'alert alert-success';
            document.getElementById('payment-message').innerHTML = 'Transaction complétée !';        });
    }
}).render('#paypal-button-container');

