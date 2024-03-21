(function() {
	'use strict';

	var tinyslider = function() {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();


	var sitePlusMinus = function() {

		var value,
    		quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
	      var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
	      var increase = quantityContainer.getElementsByClassName('increase')[0];
	      var decrease = quantityContainer.getElementsByClassName('decrease')[0];
	      increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
	      decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
	    }

	    function init() {
	        for (var i = 0; i < quantity.length; i++ ) {
						createBindings(quantity[i]);
	        }
	    };

	    function increaseValue(event, quantityAmount) {
	        value = parseInt(quantityAmount.value, 10);

	        console.log(quantityAmount, quantityAmount.value);

	        value = isNaN(value) ? 0 : value;
	        value++;
	        quantityAmount.value = value;
	    }

	    function decreaseValue(event, quantityAmount) {
	        value = parseInt(quantityAmount.value, 10);

	        value = isNaN(value) ? 0 : value;
	        if (value > 0) value--;

	        quantityAmount.value = value;
	    }

	    init();

	};
	sitePlusMinus();

	function displayProducts(limit = null) {
		const productListContainer = document.getElementById('product-list');
		if (!productListContainer) {
			console.log("Product list container not found");
			return;
		}
		productListContainer.innerHTML = '';

		let displaySet = products;
		if (limit) {
			displaySet = products.slice(0, limit);
		}

		displaySet.forEach(product => {
			const productElement = `
            <div class="col-12 col-md-4 col-lg-3 mb-5">
                <div class="product-item">
                    <img src="${product.image}" class="img-fluid product-thumbnail" alt="product">
                    <h3 class="product-title">${product.name}</h3>
                    <strong class="product-price">$${product.price.toFixed(2)}</strong>
                </div>
            </div>
        `;
			productListContainer.innerHTML += productElement;
		});
	}

	window.addEventListener('load', function() {
		if (document.body.id === "indexPage") {
			displayProducts(3);
		} else if (document.body.id === "shopPage") {
			displayProducts();
		}
	});
})()