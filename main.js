const urlApi = "http://localhost:3000/api/teddies";
const productsElt = document.getElementById("products");


fetch(urlApi) //Requête AJAX (FETCH) récupérant les éléments sur l'URL (avec promesse)
    .then(response => response.json()) //Promesse de récupération de la réponse du serveur et transformation des éléments en objets Javascript
   
    .then(products => { 

        products.forEach( product => {
            const {_id, name, price, imageUrl, description} = product;
            productsElt.innerHTML += 
            `
            <div class="card-deck col-10 col-md-6 col-lg-4 my-4">
                <div id="${name}" class="card shadow-lg bg-dark">
                    <img class="card-img-top"src="${imageUrl}" alt="peluche '${name}'"></img>
                    <div class="card-body">
                        <h5 class="card-title text-light text-center text-sm-left">${name}</h5>
                        <p class="card-text text-light d-none d-sm-block">${description}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <p class="text-warning">${price/100}€</p>
                        <a href="produit.html?id=${_id}" class="btn btn-secondary shadow" data-toggle="button" aria-pressed="false" autocomplete="off">Voir le produit</a>
                    </div>
                </div>
            </div>
            `
           
        });
        onLoadCartNumber(); //Fonction permettant l'affichage du nombre d'élément présent dans le panier sur l'icône en haut à droite
     }) 
    .catch(error => { // Si la requête du serveur n'a pas abouti, l'erreur s'affiche dans la console
        console.error('server response : ' + error.status);
        productsElt.innerHTML += 
            `
            <div class="col-12 text-center">
                <h1 class="text-light mt-5">Erreur du serveur : ${error.status} !</h1>
            </div>
            `
    });
