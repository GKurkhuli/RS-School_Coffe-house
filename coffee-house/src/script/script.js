const currentHTML = document.body.getAttribute("data-html-file");

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

//assign child's height to ot's parent, when child absolutely positioned
const setParenHeight = (parent, height) =>{
   parent.style.height = `${Math.ceil(height)}px`;
}


if (currentHTML === "home") {

    /*Slider Change*/
    let sliderCurrent = 0;

    const slitederChange = () =>{
        const slider_items = document.querySelectorAll(".roulette__menu__object__item__view__content");
        const slider_indicator = document.querySelectorAll(".roulette__menu__options__option");
        const slider_indicator_current = "roulette__menu__options__option__current";
        if(sliderCurrent >= slider_items.length){
            sliderCurrent = slider_items.length - 1;
        }else if(sliderCurrent < 0){
            sliderCurrent = 0;
        }

        if(sliderCurrent === 0) {
            slider_indicator[0].classList.add(slider_indicator_current);
            slider_indicator[1].classList.remove(slider_indicator_current);
            slider_indicator[2].classList.remove(slider_indicator_current);
        }else if(sliderCurrent === slider_items.length - 1){
            slider_indicator[0].classList.remove(slider_indicator_current);
            slider_indicator[1].classList.remove(slider_indicator_current);
            slider_indicator[2].classList.add(slider_indicator_current);
        }else{
            slider_indicator[0].classList.remove(slider_indicator_current);
            slider_indicator[1].classList.add(slider_indicator_current);
            slider_indicator[2].classList.remove(slider_indicator_current);
        }

        slider_items[sliderCurrent].style.transform = "none";
        slider_items[sliderCurrent].style.zIndex = 1;
        let sliderOrder = 0
        for(let i = sliderCurrent +1; i < slider_items.length; i++) {
            sliderOrder++;
            slider_items[i].style.transform =`translateX(calc(110% * ${sliderOrder}))`;
            slider_items[i].style.zIndex = -1;
        }
        
        sliderOrder = 0
        for(let i = sliderCurrent -1; i >= 0; i--) {
            sliderOrder++;
            slider_items[i].style.transform =`translateX(calc(110% * (${-sliderOrder})))`;
            slider_items[i].style.zIndex = -1;
        }
    }

    /*slider buttons*/
    const slide_button_events = ()=>{
        const btn_nxt = document.getElementById("button_next");
        const btn_pre = document.getElementById("button_previous");
        const roulette = document.querySelector(".roulette__menu__object");
        let touchStartX = 0;
        let touchEndX = 0;
        //btn <> events. make sure not to forget to deal with clickability if last element
        btn_nxt.addEventListener("click", () => {
            sliderCurrent++;
            slitederChange();
        });
        btn_pre.addEventListener("click", () => {
            sliderCurrent--;
            slitederChange();
        });
        //add swiping event listeners
        const swipe = () =>{
            const dir = touchEndX - touchStartX;
            if (dir > 10){ //if swiped right
                sliderCurrent--
                slitederChange()
            }else if(dir < -10){//if swiped left
                sliderCurrent++
                slitederChange();
            }
            console.log(dir);
        };
        roulette.addEventListener("touchstart", (event) => {
            touchStartX = event.touches[0].clientX;
        })
        roulette.addEventListener("touchend", (event) => {
            touchEndX = event.changedTouches[0].clientX;
            swipe();
        })
    }
    /*slider Building*/
    const sliderBuilder = () => {
        fetch("src/script/json/slider.json")
        .then(function(response){
            return response.json();
        })
        .then(function(items){
            const sliderItems = document.querySelector('.roulette__menu__object__item__view');
            let innerHTML = "";
            let index = 0;
            
            items.forEach(item =>{
                innerHTML += `
<div class="roulette__menu__object__item__view__content" id = "slider_item-${index}">
    <div class="roulette__menu__object__item__view__content__image"><img src="${item.image}" alt="${item.name}"></div>
    <div class="roulette__menu__object__item__view__content__product">
        <p class="roulette__menu__object__item__view__content__product-header">${item.name}</p>
        <p class="roulette__menu__object__item__view__content__product-description">${item.description}</p>
        <p class="roulette__menu__object__item__view__content__product-price">$${item.price}</p>
    </div>
</div>
                `;
                index++;
            })
            sliderItems.innerHTML = innerHTML;

            /*change height of parent element depending on its abslutely psitioned child element in roulette*/
            const slider_item = document.querySelectorAll(".roulette__menu__object__item__view__content");
            const resizeObserver = new ResizeObserver(entries =>{
                for(let entry of entries) {
                    setParenHeight(sliderItems, entry.contentRect.height);
                }
            });
            resizeObserver.observe(slider_item[0]);

            slitederChange();
            slide_button_events();
        });
    }
    sliderBuilder();


}else if(currentHTML === "menu") {
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
            const backdrop = document.getElementById("modal_backDrop");

            menu__item.addEventListener('click', () => {
            backdrop.classList.add("modal_backDrop_show");
            modal.classList.add("menu__items__modal__show");

            backdrop.addEventListener("click",()=>{
                modal.classList.remove("menu__items__modal__show");
                backdrop.classList.remove("modal_backDrop_show");
            });
            
            document.addEventListener("keydown",(event) =>{
                if(event.key === "Escape") {
                    modal.classList.remove("menu__items__modal__show");
                    backdrop.classList.remove("modal_backDrop_show"); 
                }
            });
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
                modal.classList.remove("menu__items__modal__show");
                backdrop.classList.remove("modal_backDrop_show"); 
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
            const menu_items = document.querySelector('.menu__items');
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
                        <div class="menu__items__modal" id = "${pName}__modal">
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
                        </div>
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
    refresh_button.addEventListener("click",() =>{
        const radios = document.querySelectorAll("input[name = 'menu__offer-type']");
        const menu = document.querySelector(".menu");

        window.scrollTo({top:menu});

        const radio = radios[0]; //change menu content
        radio.checked = true;
        menu_display();
    });   
}

