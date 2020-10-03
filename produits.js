// Déclaration de l'URL suivi de l'id du teddy sélectionné via la fonction search 
// et à partir du 4ème caractère avec substring (sans le ?id=)
const urlApiteddy = "http://localhost:3000/api/teddies" + "/" + location.search.substring(4);;
const content = document.getElementById("product");
let unit = document.getElementById("unit");


fetch(urlApiteddy)
    .then(response => response.json())  
    .then(product => {
              
        const {colors, _id, name, price, imageUrl, description} = product;
        content.innerHTML += 

        `
        <div class="row rounded shadow-lg bg-dark col-md-10 col-lg-12 justify-content-center p-0 p-lg-0">
            <div id="${name}" class="col-xl-12 col-md-12 p-0 d-flex flex-column flex-lg-row p-lg-0">
                    <img class="img-fluid rounded-left img-responsive col-lg-7 p-lg-0" src="${imageUrl}" alt="peluche '${name}'"></img> 
                    <div class="mb-3 py-4 pr-0 row col-lg-5">
                        <h3 class="col-12 text-light text-center font-weight-bold">${name}</h3> 
                        <p class="col-12 text-light">${description}</p>
                        <h4 class="col-12 lead text-warning font-weight-bolder text-right">${price/100}€</h4>
                        <hr>
                        <div class="card-footer d-flex flex-sm-row flex-column justify-content-center align-items-center col-12">
                            <label class="text-warning" for="teddy_colors">couleur:</label>
                            <select id="teddy_colors" aria-label="Choix de la couleur" class="ml-2 custom-select-sm col-lg-9 col-sm-7 col-auto text-center">
                                <option value="0" selected>--Veuillez choisir votre couleurs--</option>
                            </select>
                        </div>
                        <div class="card-footer d-flex justify-content-sm-around justify-content-between align-items-center col-12">
                            <form class="col-4 col-sm-2 col-md-2 col-lg-3">
                                <input id="quantity" type="number" value="1" aria-label="Search" class="form-control">
                            </form>
                            <button id="addCart" class="btn btn-secondary shadow btn-md my-0 text-right col-xl-6 col-lg-8 col-sm-5 col-auto" type="submit">Ajoutez au panier
                            <i class="fa fa-shopping-cart ml-1"></i>
                            </button>
                        </div>
                    </div>
            </div>
        </div>
        `;
        
        //Boucle permettant d'afficher les différents couleurs dans le selecteur
        const teddycolors = document.getElementById("teddy_colors");
        for( i = 0 ; i < product.colors.length ; i++) {                             
            teddycolors.innerHTML +=
            `<option value="${product.colors[i]}">"${product.colors[i]}"</option>`;
           
        };

        const addCart = document.getElementById("addCart");
        addCart.addEventListener("click", () => { 
                let teddy = document.getElementById("teddy_colors").value; // Déclaration du choix de la couleur par l'acheteur
            
                let quantity = document.getElementById("quantity").value; // Déclaration de la quantité sélectionnée par l'acheteur
                quantity = Number(quantity);

                // Cette condition permet de s'assurer que l'acheteur entre une quantité valide
                if(teddy <= 0) {
                    swal("Veuillez sélectionner une couleur", "", "erreur"); // Utilisation de sweetalert afin d'afficher un message d'erreur
            
                } else if(quantity < 1) {
                    swal("Veuillez saisir une quantité valide", "", "erreur");

                } else {
                    // Déclaration de cart, un objet représentant une peluche type avec la nouvelle propriété "quantity"
                    let teddy = {
                        "id" : _id,
                        "name" : name,
                        "price" : price/100,            
                        "colors" : colors,
                        "quantity" : quantity,
                        "imageURL" : imageUrl,
                        "priceTotal" : (price/100)*quantity
                    }   
                    swal("Votre ourson vous attend !!!", "", "success");

                    // Utilisation du LocalStorage
                    let cartItems = JSON.parse(localStorage.getItem("teddyCart")) || [];
                    let teddyNumber = localStorage.getItem("cartNumber") || 0;
                    teddyNumber = Number(teddyNumber);
                                
                    // Si le localStorage est vide
                    if ((cartItems === null) || (cartItems.length == 0)) { 
                        cartItems.push(teddy);       // On ajoute la peluche sélectionnée dans le tableau vide "cartItems"
                        localStorage.setItem("teddyCart", JSON.stringify(teddy)); // Puis on l'ajoute à la clé teddyCart
                        localStorage.setItem("cartNumber", quantity); // Ajout de la clef number pour compter la quantité de produit dans le panier

                    } else {    // Par contre, si le localStorage a déjà du contenu
                        let duplicate = false; // Cette déclaration servira pour contrôler les doublons
                        
                        for(let i = 0; i < cartItems.length; i++) {   // Recherche dans le tableau du localStorage
                            
                            // S'il y a déjà un item avec un nom ET une couleur identique
                            if((cartItems[i].id == teddy.id) && (cartItems[i].colors == teddy.colors)) { 
                                let sumQuantity = Number(cartItems[i].quantity) + Number(teddy.quantity);
                                    // On additionne la valeur de la quantité en cours d'ajout et celle déjà présente dans le panier
                            
                                cartItems[i].quantity = sumQuantity.toString();
                                cartItems[i].priceTotal = sumQuantity * cartItems[i].price;

                                duplicate = true;                                
                            }
                        }
                        
                        if (duplicate == false) {
                        // S'l y a déjà des produits dans le panier mais différents
                        cartItems.push(teddy);       
                        // On les ajoute au tableau cartItems  
                        }
                    }
                    localStorage.setItem("teddyCart", JSON.stringify(cartItems));  //Ajout au localStorage
                    localStorage.setItem("cartNumber",  teddyNumber += quantity);                    
                } 
                onLoadCartNumber();  //Chargement du nombre d'article dans le panier  
        }); 
    
    }) 
    .catch(error => { // Si la requête du serveur n'a pas abouti, l'erreur s'affiche sur la page
        console.error('server response : ' + error.status);
        productsElt.innerHTML += 
            `
            <div class="col-12 text-center">
                <h1 class="text-light mt-5">Erreur du serveur : ${error.status} !</h1>
                <h3 class="text-light">Veuillez lancer le serveur via un terminal avec la commande "npm start" ou contactez l'administrateur.</h3>
            </div>
            `;
    });
onLoadCartNumber();   //Chargement du nombre d'article dans le panier   

