const postUrlAPI = "http://localhost:3000/api/teddies/order";
let contact = JSON.parse(localStorage.getItem("contact")) || {};
let products = JSON.parse(localStorage.getItem("products")) || [];

// Déclaration d'une constante pour contacter l'api teddies/order
const request = new Request(postUrlAPI, {
    method: 'POST',
    body: JSON.stringify({contact, products}),  
    // Pour valider la requête on a besoin d'un objet JSON contenant "contact" && "products"
    headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    })
});

fetch(request)
    .then(response => response.json())
    .then(data => {
        
        let cartItems = JSON.parse(localStorage.getItem("teddyCart"));
        localStorage.setItem("orderId", data.orderId); // récupère l'order ID donné par le serveur
        let total = localStorage.getItem("total");
        let orderId = localStorage.getItem("orderId");
        let recap = document.getElementById("recap");

        recap.innerHTML = 
        `<div class="row justify-content-center">
            <div class="col-8 py-3 bg-dark text-light text-center rounded border-2">
                <h3>Votre commande a bien été enregistré</h3>
                <h5>Vous allez recevoir un email contenant votre facture</h5>
                <h5 class="mt-4 text-center">Numéro de commande: </h5>
                <h6 class="text-warning">${orderId}</h6>
                <h4 class="mt-4">Le montant de votre commande est de : </h4> 
                <h4 class=" text-warning">${total} €</h4>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="my-3 text-center">
                <h5 class="text-center text-light bg-dark mt-5 p-2 col-auto"> Récapitulatif de votre commande : </h5>
                <div class="row m-0 justify-content-center my-3" id="class_table">
                    <table class="text-center shadow-lg bg-dark col-11 table">
                        <thead>
                            <tr class="text-light">
                                <th class="col-sm-2 d-none d-sm-table-cell" style="width: 16.66%"></th>
                                <th class="col-sm-4 col-5" style="width: 33.33%">Nom</th>
                                <th class="col-sm-4 col-5" style="width: 33.33%">couleurs</th>
                                <th class="col-sm-2 col-3" style="width: 16.66%">Quantité</th>   
                            </tr>
                        </thead>
                        <tbody id="table_cart">
                        </tbody>
                    </table>
                </div> 
            </section>
        </div>
        <h3 class=" text-center"> Orinoco vous remercie et vous souhaite une excellente journée </h3> 
        `
        const content = document.getElementById("table_cart");
        cartItems.forEach(cartItem => {
            content.innerHTML +=
                `
                        <tr class="text-light">
                            <td class="align-middle d-none d-sm-table-cell">
                                <img class="mw-100 p-0" src="${cartItem.imageURL}" alt="Image de la peluche ${cartItem.name}"/>
                            </td>
                            <td class="align-middle">
                                <span>${cartItem.name}</span>
                            </td>
                            <td class="align-middle">
                                <span>${cartItem.color}</span>
                            </td>
                            <td class="align-middle">
                                <span>${cartItem.quantity}</span>
                            </td>
                        </tr>  
                ` 
        });
        localStorage.removeItem("teddyCart");
        localStorage.removeItem("cartNumber");
        localStorage.removeItem("total");

        //Suppression du localStorage à la fermeture de la page (Actualisation, fermeture, ou clic sur une autre page)
        window.addEventListener("unload", () => { 
            localStorage.clear();
        });
    })
    .catch(error => {
        console.error('server response : ' + error.status);
        swal("Une erreur c'est produite, merci de recommencer ou de contacter l'administrateur", "", "error")
        setTimeout(function(){document.location.href="index2.html"; }, 5000);
    });