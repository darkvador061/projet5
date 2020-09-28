function onLoadCartNumber () {
    let teddyNumber = localStorage.getItem("cartNumber");
    
    if(teddyNumber) {
        unit.textContent = teddyNumber;
    };
}