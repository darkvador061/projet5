onLoadCartNumber();
displayCart();



function displayCart() {

    const content = document.getElementById("table_cart");
    let cartItems = JSON.parse(localStorage.getItem("teddyCart")) || [];

    // Ne garder que les produits dans la quantité > 0 et supprimer le reste
    cartItems = cartItems.filter(cartItem => {
        return (cartItem.quantity > 0);
    });
    localStorage.setItem("teddyCart", JSON.stringify(cartItems));

    //Actualisation de la clé cartNumber pour permettre son affichage sur l'icone du panier
    const sumOfQuantity = cartItems.reduce((sum, cartItem) => sum + Number(cartItem.quantity), 0); 
    localStorage.setItem("cartNumber", sumOfQuantity);
    onLoadCartNumber();
    

    if ((cartItems == null) || (cartItems.length == 0)) {   // Si le panier est vide
        window.localStorage.clear();
        let noCart = document.getElementById("no_product")
        noCart.innerHTML =
            `
            <div class="col-12 text-center bg-sm-none bg-dark">
                <h1 class="text-light mt-5">Votre panier est vide !</h1>
                <h3><a href="index2.html" class="text-light mt-5">Retour à la page d'accueil</a></h3>
            </div>
            `    
    }else if (cartItems && content){ //S'il y du contenu dans le panier on l'affiche
        content.innerHTML = "";
        cartItems.forEach(cartItem => {   
            content.innerHTML += `
            <tr class="text-light border-top border-grey">
                <td class="d-none d-md-table-cell">
                    <img class="mw-100" src="${cartItem.imageURL}" alt="Image de la peluche ${cartItem.name}"/>
                </td>
                <td class="align-middle">
                    <a href="produit.html?id=${cartItem.id}" class="text-light">${cartItem.name}</a>
                </td>
                <td class="align-middle">
                    ${cartItem.colors}
                </td>
                <td class="align-middle">
                    ${cartItem.price} €
                </td>
                <td class="align-middle">
                    <span class="fas fa-minus-circle mx-1 downcrease" itemId="${cartItem.id}" itemColors="${cartItem.colors}" name="minus"></span>
                        <span>${cartItem.quantity}</span>
                    <span class="fas fa-plus-circle mx-1 upcrease" itemId="${cartItem.id}" itemColors="${cartItem.colors}" name="plus"></span>
                </td>
                <td class="align-middle d-none d-md-table-cell">
                    ${cartItem.priceTotal} €
                </td>
                <td class="align-middle d-none d-sm-table-cell">
                    <span class="fas fa-trash-alt removeItem" itemId="${cartItem.id}" itemColors="${cartItem.colors}"></span>
                </td>
            </tr>
            `;
        }); 
        
        optionCart();
    };
};

function optionCart() {
    let upQuantity = document.querySelectorAll(".upcrease");
    let downQuantity = document.querySelectorAll(".downcrease");
    let removeItem = document.querySelectorAll(".removeItem");
    let cartItems = JSON.parse(localStorage.getItem("teddyCart"));
    let teddyNumber = localStorage.getItem("cartNumber") || 0;


    // Fonction affichant le prix total du panier dans la clé "total" du localStorage ainsi que dans le span du prix total de la commande
    let priceProducts = 0;
    let Total = document.querySelector("div h5 span");
    cartItems.forEach(cartItem => {
        priceProducts += cartItem.priceTotal;
        localStorage.setItem("total", priceProducts);
        Total.innerHTML = `${priceProducts}`;
    });

    
    // Fonction d'incrémentation
    //Array.from permet d'utiliser les propriétés d'un tableau sur des objets itérables
    Array.from(upQuantity).forEach(button => {
        button.addEventListener("click", (e) => {
            const id = e.target.getAttribute("itemId");
            const colors = e.target.getAttribute("itemColors")
            cartItems = cartItems.map(cartItem => {
                if (cartItem.id == id && cartItem.colors == colors) {
                    cartItem.quantity++;
                    cartItem.priceTotal = cartItem.price * cartItem.quantity;
                    localStorage.setItem("teddyCart", JSON.stringify(cartItems));
                    displayCart();
                }
            });
        });
    });

    //Fonction de décrémentation
    Array.from(downQuantity).forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute("itemId");
            const colors = e.target.getAttribute("itemColors")
            cartItems = cartItems.map(cartItem => {
                if (cartItem.id == id && cartItem.colors == colors) {
                    cartItem.quantity--;
                    cartItem.priceTotal = cartItem.price * cartItem.quantity;
                    localStorage.setItem("teddyCart", JSON.stringify(cartItems));
                    displayCart();
                    
            
                } if (cartItem.quantity == 0) {
                    displayCart();
                };
            });
        });
    });


    //Fonction de suppression d'un élément du panier
    Array.from(removeItem).forEach(button => {
        button.addEventListener("click", (e) => {
            const id = e.target.getAttribute("itemId");
            const colors = e.target.getAttribute("itemColors")
            cartItems.forEach(cartItem => {
                if (cartItem.id == id && cartItem.colors == colors) {
                    cartItem.quantity = 0;
                    localStorage.setItem("teddyCart", JSON.stringify(cartItems));
                    displayCart();
                } 
            });
        });
    });


};
//Fonction qui permet de vider le panier
document.getElementById("delete_cart").addEventListener("click", () => {    
    swal({
        title: "Êtes-vous sûr ?",
        icon: "warning",
        buttons: {
            cancel: "Annuler",
            catch: {
                text: "Confirmer",
                value: "delete",
            }
        },
        dangerMode: true,
    })
    .then((value) => {
        switch (value) {
            case "delete":
                localStorage.clear();
                swal({
                    title: "Votre panier à bien été supprimer",
                    icon: "success",
                    buttons: {
                        catch: {
                            text: "Retour",
                            value: "back",
                        }
                    },
                })
                .then((value) => {
                    switch (value) {
                        case "back":
                            location.reload();
                            break;   
                    }
                })
                break;
        };
    }); 
});

//Fonction de validation du panier
document.getElementById("confirm_cart").addEventListener("click", () => {
    document.getElementById("no_product").innerHTML = 
    `
    <section id="form">
        <div class="d-flex justify-content-center">
            <form class="col-md-6 col-10 text-light bg-dark">
                <h2 class="text-center mt-5">Confirmation de commande : </h2>
                <div class="form-group mt-4">
                    <label for="FirstName">Prénom</label>
                    <input type="text" class="form-control" id="firstName" aria-describedby="emailHelp" placeholder="John" required>
                </div>
                <div class="form-group">
                    <label for="LastName">Nom</label>
                    <input type="text" class="form-control" id="lastName" placeholder="Doe" required>
                </div>
                <div class="form-group">
                    <label for="Adress">Adresse</label>
                    <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="1 rue de la République" required>
                </div>
                <div class="form-group">
                    <label for="City">Ville</label>
                    <input type="text" class="form-control" id="city" placeholder="Paris" required>
                </div>
                <div class="form-group">
                    <label for="Email">Email</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="mon-email@orinoco.fr" required>
                </div>
            </form>
        </div>
        <div class="d-flex justify-content-center mt-3">
            <span id="close_form" class="d-block btn btn-danger shadow mt-1 mx-1">Fermer  <i class="fas fa-times-circle"></i></span>
            <span id="confirm_order" class="btn btn-success shadow mt-1 mx-1">Envoyer  <i class="fas fa-check-circle"></i></span>
        </div>
    </section>   
    `;

    // Fonction qui se déclenche à la fermeture du formulaire
    document.getElementById("close_form").addEventListener("click", () => {
        location.reload();
    }); 
    
    //Fonction permettant la validation du formulation et l'envoi au back-end
    document.getElementById("confirm_order").addEventListener("click", () => {
        
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let address = document.getElementById('address').value;
        let city = document.getElementById('city').value;
        let email = document.getElementById('email').value;

        
        // On récupère tous les inputs du formulaire

        if(!/^[A-zÀ-ú\-'.]{2,25}$/.test(firstName)){  //REGEX
            swal("Prénom non valide, veuillez resaisir", "", "error");
        }   
        else if(!/^[A-zÀ-ú\-'.]{2,25}$/.test(lastName)){ //REGEX
            swal("Nom non valide, veuillez resaisir", "", "error");
        }
        else if(!/^[0-9]+[A-zÀ-ú\-\s'.]{5,60}$/.test(address)){ //REGEX
            swal("Veuillez saisir une adresse valide", "", "error");
        }
        else if(!/^[A-zÀ-ú\-\s'.]{2,25}$/.test(city)){  //REGEX
            swal("Ville non reconnue, veuillez resaisir", "", "error");
        }
        else if(!/^[^\W][A-ù0-9_\-\.]{3,25}\@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,6}$/.test(email)){ //REGEX
            swal("Veuillez entrer une adresse email valide", "", "error");
        } else{ 

        let contact = {};
        contact["firstName"] = firstName;
        contact["lastName"] = lastName;
        contact["address"] = address;
        contact["city"] = city;
        contact["email"] = email;
        //Si les inputs sont valides on les rentres dans un objet "contact"

        // On déclare ensuite notre tableau products
        const products = [];
        let cartItems = JSON.parse(localStorage.getItem("teddyCart"));

        cartItems.forEach(cartItem => { // Pour chaque item présent dans le panier, on ajoute l'id du produit dans l'array products
            for(let i = 0; i < cartItem.quantity; i++){ 
                products.push(cartItem.id);
            };
        });

        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("contact", JSON.stringify(contact));

        document.location.href="commande.html";
        };
    });
});