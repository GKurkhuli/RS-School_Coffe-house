/*Burger menu button behavior*/
const btn = document.getElementById('burger-menu__button');
const nav = document.querySelector('.nav-bar__navigation');

btn.addEventListener("click", () => {
  btn.querySelectorAll("span").forEach((span) => span.classList.toggle("open"));
  nav.classList.toggle("show");
});

nav.querySelectorAll("a").forEach((link) =>{
    link.addEventListener("click", () => {
        btn.querySelectorAll("span").forEach((span) => span.classList.toggle("open"));
        nav.classList.toggle("show");
    });
});


/*Modal total price*/
const total_price_calculator = (name, price, radios, checkboxes) => {
    const total_price = document.getElementById(`${name}__total`);

    let total = Number(price);
    radios.forEach(radio =>{
        if(radio.checked) {
            total += Number(radio.value);
        }
    });
    checkboxes.forEach(checkbox => {
        if(checkbox.checked) {
            total += Number(checkbox.value);
        }
    });
    total_price.innerHTML = `$${total}`;           
}
/*Event hadlers for menu_item and modal*/
const menu__items__events = (names) =>{
    names.forEach(name => {
        const menu__item = document.querySelector(`#${name[0]}`);
        const modal = document.getElementById(`${name[0]}__modal`);
        const modal_radio = document.querySelectorAll(`input[name='menu__items__modal-description__details-size__${name[0]}']`);
        const modal_check = document.querySelectorAll(`input[name='menu__items__modal-description__details-additives__${name[0]}']`);
        const modal_close = document.getElementById(`${name[0]}_close`);
        //modal.style.display = 'none';
        menu__item.addEventListener('click', () => {
            modal.showModal();
           // modal.style.display = "flex"; 
        });
    
        modal_radio.forEach(radio => {
            radio.addEventListener("change", () => {
            total_price_calculator(name[0], name[1], modal_radio, modal_check);
            });
        });
    
        modal_check.forEach(checkbox => {
            checkbox.addEventListener("change", () => {
            total_price_calculator(name[0], name[1], modal_radio, modal_check);
            });
        });
    
        modal_close.addEventListener("click", () => {
            modal.close();
           // modal.style.display = "none";
        });
    }); 
}

/*Menu Items select and json*/
const menu_radio = document.querySelectorAll("input[name = 'menu__offer-type']");

const menu_display = () => {
    const checked_category = document.querySelector("input[name = 'menu__offer-type']:checked").value;
    fetch("src/script/json/products.json")
    .then(function(response){
        return response.json();
    })
    .then(function(products){
        let menu_items = document.querySelector('.menu__items');
        let innerHTML = "";
        names = [];

        for(let product of products) {
            if(product.category === checked_category){
                const pName = product.name.split(' ').join('_');
                names.push([pName, product.price]);
                innerHTML += `
                    <div class="menu__items__item" id = "${pName}">
                        <div class="menu__items__item-img"><img src="${product.image}"></div>
                        <div class="menu__items__item-description">
                            <div class="menu__items__item-description-contain">
                                <h3>${product.name}</h3>
                                <p class="menu__items__item-description-contain__desc">${product.description}</p>
                            </div>
                            <p class="menu__items__item-description__price">$${product.price}</p>
                        </div>
                    </div>
                    <dialog class="menu__items__modal" id = "${pName}__modal">
                        <div class="menu__items__modal-img"><img src="${product.image}" alt="coffee_1"></div>
                        <div class="menu__items__modal-description">
                            <div class="menu__items__modal-description__title">
                                <h3>${product.name}</h3>
                                <p class="menu__items__modal-description__description">${product.description}</p>
                            </div>
                            <div class="menu__items__modal-description__details">
                                <p class="menu__items__modal-description__details-title">Size</p>
                                <ul class="menu__items__modal-description__details-list">
                                    <li>
                                        <input type="radio" name="menu__items__modal-description__details-size__${pName}" id="${pName}__size-S" value="${product.sizes.s["add-price"]}"  checked="checked">
                                        <label for="${pName}__size-S"><span>S</span>${product.sizes.s.size}</label>
                                    </li>
                                    <li>
                                        <input type="radio" name="menu__items__modal-description__details-size__${pName}" id="${pName}__size-M" value="${product.sizes.m["add-price"]}">
                                        <label for="${pName}__size-M"><span>M</span>${product.sizes.s.size}</label>
                                    </li>

                                    <li>
                                        <input type="radio" name="menu__items__modal-description__details-size__${pName}" id="${pName}__size-L" value="${product.sizes.l["add-price"]}">
                                        <label for="${pName}__size-L"><span>L</span>400 ml</label>
                                    </li>
                                </ul>
                            </div>
                            
                            <div class="menu__items__modal-description__details">
                                <p class="menu__items__modal-description__details-title">Additives</p>
                                <ul class="menu__items__modal-description__details-list">
                                    <li>
                                        <input type="checkbox" name="menu__items__modal-description__details-additives__${pName}" id="${pName}__additive-1" value="${product.additives[0]["add-price"]}">
                                        <label for="${pName}__additive-1"><span>1</span>${product.additives[0].name}</label>
                                    </li>

                                    <li>
                                        <input type="checkbox" name="menu__items__modal-description__details-additives__${pName}" id="${pName}__additive-2" value="${product.additives[1]["add-price"]}">
                                        <label for="${pName}__additive-2"><span>2</span>${product.additives[1].name}</label>
                                    </li>
                                    
                                    <li>
                                        <input type="checkbox" name="menu__items__modal-description__details-additives__${pName}" id="${pName}__additive-3" value="${product.additives[2]["add-price"]}">
                                        <label for="${pName}__additive-3"><span>3</span>${product.additives[2].name}</label>
                                    </li>
                                </ul>
                            </div>
                            <div class="menu__items__modal-description__total">
                                <p class="menu__items__modal-description__total-text">Total:</p>
                                <p class="menu__items__modal-description__total-price" id = "${pName}__total">${product.price}</p>
                            </div>

                            <div class="menu__items__modal-description__alert">
                                <p class="menu__items__modal-description__alert-icon"><ion-icon name="alert-circle-outline"></ion-icon></p>
                                <p class="menu__items__modal-description__alert-text">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
                            </div>
                            <button class="menu__items__modal-description__button" id = "${pName}_close">Close</button>
                        </div>
                    </dialog>
                `; 
            }
        }
        menu_items.innerHTML = innerHTML;
        menu__items__events(names);
    });
}      

menu_radio.forEach(category=>{
    category.addEventListener("change", menu_display);
});
menu_display();

/*add refresh button behavior*/
refresh_button = document.querySelector('#Menu__refresh-button');
refresh_button.addEventListener("clic",menu_display);

