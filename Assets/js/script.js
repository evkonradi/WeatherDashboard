selectedCitiesEl = document.querySelector("#selectedCities");
searchCityInputEl = document.querySelector("#searchCityInput");

var searchCity = function(){
    if (!searchCityInputEl.value){
        return;
    }

    var liEl = document.createElement("li");
    liEl.innerHTML = searchCityInputEl.value;
    liEl.className= "list-group-item";
    selectedCitiesEl.appendChild(liEl);

    searchCityInputEl.value = "";
}