import { RedirectUrl } from "../Router.js";
import Navbar from "../Navbar.js";
import { getUserSessionData } from "../../utils/session.js";
import { callAPI, callAPIWithoutJSONResponse } from "../../utils/api.js";
import PrintError from "../PrintError.js"
import img1 from "./1.jpg";
import img2 from "./2.jpg";
const API_BASE_URL = "/api/furniture/";
const API_BASE_URL_ADMIN = "/api/admin/";
const IMAGES = "../../../../images";
let option;
let furniture;

let optionTaken = false;

let furniturePage = `
<h4 id="pageTitle">Furniture User</h4>
<div class="row">
  <div class="col-6">
  <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="${img1}" class="d-block w-100" alt="1">
    </div>
    <div class="carousel-item">
      <img src="${img2}" class="d-block w-100" alt="2">
    </div>
    <div class="carousel-item">
      <img src="${img2}" class="d-block w-100" alt="3">
    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
  </div>
  </br>
  <button class="btn btn-secondary" id="btnReturn">Retour</button>
</div>

<div class="col-6">
  <div class="form-group">
    <div class="row">
      <div class="col-6">
          <div class="form-group">
            <label for="type">Type de meuble</label>
            <div id="type"></div>
          </div>
      </div>
      <div class="col-6">
      <div class="form-group">
          <label for="purchasePrice">Prix d'achat</label>
          <div id="purchasePrice"></div>
      </div>
      </div>
      <div class="col-6">
        <div class="form-group">
            <label for="prix">Prix de vente</label>
            <div id="prix"></div>
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
            <label for="specialPrice">Prix de vente spécial</label>
            <div id="specialPrice"></div>
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
            <label for="withdrawalDateFromCustomer">Date de retrait</label>
            <div id="withdrawalDateFromCustomer"></div>
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
            <label for="deliveryDate">Date de livraison</label>
            <div id="deliveryDate"></div>
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
            <label for="withdrawalDateToCustomer">Date de retrait par le client</label>
            <div id="withdrawalDateToCustomer"></div>
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
            <label for="buyerEmail">Email du client</label>
            <div id="buyerEmail"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-12">
      <div class="form-group">
        <label for="furnituredescription">Description du meuble</label>
        <div id="furnitureDescription"></div>
      </div>
    </div>
  </div>
  
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <label class="input-group-text" for="inputGroupSelect01">Etat du meuble</label>
    </div>
    <select class="custom-select" id="conditions">
      <option id="propose" value="propose">Proposé</option>
      <option id="ne_convient_pas" value="ne_convient_pas">Ne convient pas</option>
      <option id="achete" value="achete">Acheté</option>
      <option id="emporte_par_patron" value="emporte_par_patron">Emporté par le patron</option>
      <option id="en_restauration" value="en_restauration">En restauration</option>
      <option id="en_magasin" value="en_magasin">En magasin</option>
      <option id="en_vente" value="en_vente">En vente</option>
      <option id="retire_de_vente" value="retire_de_vente">Retiré de la vente</option>
      <option id="en_option" value="en_option">En option</option>
      <option id="vendu" value="vendu">Vendu</option>
      <option id="reserve" value="reserve">Réservé</option>
      <option id="livre" value="livre">Livré</option>
      <option id="emporte_par_client" value="emporte_par_client">Emporté par le client</option>
    </select>
  </div>

  <button class="btn btn-success" id="btnSave" type="submit">Enregistrer</button>
  <p>
  <div id=option></div>

  <div id="toast"></div>

</div>
`;

let isOption = `
<div class="alert alert-secondary" role="alert">
  Il y a une option sur ce meuble (<strong><span id="userOption"> </span></strong>).
</div>
<button class="btn btn-danger" id="btnOption" type="submit">Annuler l'option</button>
  `;

let noOption =`
<div class="alert alert-secondary alert-dismissible fade show" role="alert">
  Il n'y a aucune option sur ce meuble.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`;

const FurnitureAdmin = async(f) => {
  let page = document.querySelector("#page");
  page.innerHTML = furniturePage;

  let btnSave = document.querySelector("#btnSave");
  btnSave.addEventListener("click", onSave);

  let btnReturn = document.querySelector("#btnReturn");
  btnReturn.addEventListener("click", () => RedirectUrl("/search"));


  if(f == null){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let id = urlParams.get("id");
    try {
      furniture = await callAPI(API_BASE_URL + id , "GET", undefined);
    } catch (err) {
      console.error("FurnitureUser::GetFurnitureByID", err);
      PrintError(err);
    }
  }else{
    furniture = f;
  }
  console.log(furniture);
  try {
    const types = await callAPI(API_BASE_URL + "allFurnitureTypes", "GET", undefined);
    onTypesList(types);
  } catch (err) {
    console.error("FurnitureAdmin::onTypesList", err);
    PrintError(err);
  }

  let optionCondition = document.querySelector("#"+furniture.condition);
  optionCondition.setAttribute("selected","");
  

  onFurniture();
  onCheckOption();

  let conditions = document.querySelector("#conditions");
  if(conditions.value == "en_vente"){
    onSale();
  } else if (conditions.value == "achete") {
    onPurchase();
  } else if (conditions.value == "vendu" || conditions.value == "reserve" || 
  conditions.value == "livre" || conditions.value == "emporte_par_client") {
    onBuyerEmail();
  }

  conditions.addEventListener("change",(e)=>{
    onFurniture();
    if(conditions.value == "en_vente"){
      onSale();
    } else if (conditions.value == "achete") {
      onPurchase();
    } else if (conditions.value == "vendu" || conditions.value == "reserve" || 
    conditions.value == "livre" || conditions.value == "emporte_par_client") {
      onBuyerEmail();
    }
  });
}

const onTypesList = (typesList) => {
  let typesListPage = `
  <div class="input-group mb-3">
    <select class="custom-select" id="typesList">`;
    typesList.forEach(type => {
      if(furniture.type.id == type.id)
        typesListPage += `<option id="${type.id}" selected="selected" value="${type.id}">${type.name}</option>`;
      else
        typesListPage += `<option id="${type.id}" value="${type.id}">${type.name}</option>`;
    });
  
  typesListPage += 
    `</select>
  </div>`;

document.getElementById("type").innerHTML = typesListPage;
}

const onFurniture = () => {
  let prix = document.querySelector("#prix");
  prix.innerHTML = `<input class="form-control" id="inputSellingPrice" type="number" placeholder=${furniture.sellingPrice} readonly />`;

  let specialPrice = document.querySelector("#specialPrice");
  specialPrice.innerHTML = `<input class="form-control" id="inputSpecialPrice" type="number" placeholder=${furniture.specialSalePrice} readonly />`;

  let furnitureDescription = document.querySelector("#furnitureDescription");
  furnitureDescription.innerHTML = `<textarea class="form-control" id="furnituredescription" rows="6" >${furniture.description}</textarea>`;
  
  let purchasePrice = document.querySelector("#purchasePrice");
  purchasePrice.innerHTML = `<input class="form-control" id="inputPurchasePrice" type="number" placeholder=${furniture.purchasePrice} readonly />`;

  let withdrawalDateFromCustomer = document.querySelector("#withdrawalDateFromCustomer");
  withdrawalDateFromCustomer.innerHTML = `<input class="form-control" id="inputWithdrawalDateFromCustomer" type="date" readonly/>`;

  let deliveryDate = document.querySelector("#deliveryDate");
  deliveryDate.innerHTML = `<input class="form-control" id="inputDeliveryDate" type="date" readonly/>`;

  let withdrawalDateToCustomer = document.querySelector("#withdrawalDateToCustomer");
  withdrawalDateToCustomer.innerHTML = `<input class="form-control" id="inputWithdrawalDateToCustomer" type="date" readonly/>`;

  let buyerEmail = document.querySelector("#buyerEmail");
  buyerEmail.innerHTML = `<input class="form-control" id="inputBuyerEmail" type="email" readonly/>`;
}

const onSale = () => {
  let price = document.querySelector("#prix");
  price.innerHTML = `<input class="form-control" id="inputSellingPrice" type="number" value=${furniture.sellingPrice} />`;

  let specialPrice = document.querySelector("#specialPrice");
  specialPrice.innerHTML = `<input class="form-control" id="inputSpecialPrice" type="number" value=${furniture.specialSalePrice} />`;
}

const onPurchase = () => {
  let purchasePrice = document.querySelector("#purchasePrice");
  purchasePrice.innerHTML = `<input class="form-control" id="inputPurchasePrice" type="number" value=${furniture.purchasePrice} />`;

  let withdrawalDateFromCustomer = document.querySelector("#withdrawalDateFromCustomer");
  withdrawalDateFromCustomer.innerHTML = `<input class="form-control" id="inputWithdrawalDateFromCustomer" type="date"/>`;

  let deliveryDate = document.querySelector("#deliveryDate");
  deliveryDate.innerHTML = `<input class="form-control" id="inputDeliveryDate" type="date"/>`;

  let withdrawalDateToCustomer = document.querySelector("#withdrawalDateToCustomer");
  withdrawalDateToCustomer.innerHTML = `<input class="form-control" id="inputWithdrawalDateToCustomer" type="date" />`;
}

const onBuyerEmail = () => {
  let buyerEmail = document.querySelector("#buyerEmail");
  buyerEmail.innerHTML = `<input class="form-control" id="inputBuyerEmail" type="email"/>`;
}

const onSave = async() => {
    let conditionChoice = document.querySelector("#conditions");
    conditionChoice = conditionChoice.value;

    let user = getUserSessionData();
    let p = 0;
    let specialPrice = 0;
    let purchasePrice = 0;
    let withdrawalDateFromCustomer = "";
    let deliveryDate = "";
    let withdrawalDateToCustomer = "";
    let buyerEmail = "";

    if(conditionChoice == "en_vente"){
      p = document.querySelector("#inputSellingPrice").value;
      furniture.sellingPrice = p;
      specialPrice = document.querySelector("#inputSpecialPrice").value;
      furniture.specialSalePrice = specialPrice;
    } else if(conditionChoice == "achete"){
      purchasePrice = document.querySelector("#inputPurchasePrice").value;
      furniture.purchasePrice = purchasePrice;
      withdrawalDateFromCustomer = document.querySelector("#inputWithdrawalDateFromCustomer").value;
      deliveryDate = document.querySelector("#inputDeliveryDate").value;
      withdrawalDateToCustomer = document.querySelector("#inputWithdrawalDateToCustomer").value;
    }else if (conditions.value == "vendu" || conditions.value == "reserve" || 
    conditions.value == "livre" || conditions.value == "emporte_par_client") {
      buyerEmail = document.querySelector("#inputBuyerEmail").value
    }
    let struct = {
      condition: conditionChoice,
      type: document.getElementById("typesList").value,
      purchasePrice: purchasePrice,
      sellingPrice: p,
      specialPrice: specialPrice,
      withdrawalDateFromCustomer: withdrawalDateFromCustomer,
      deliveryDate: deliveryDate,
      withdrawalDateToCustomer: withdrawalDateToCustomer,
      buyerEmail: buyerEmail,
      description: document.getElementById("furnituredescription").value
    }
    
    console.log(struct);
   
    if(conditionChoice != furniture.condition || furniture.condition == "en_vente"){
      try {
        await callAPIWithoutJSONResponse(API_BASE_URL + furniture.id, "PUT", user.token, struct);
        document.getElementById("toast").innerHTML = `</br><h5 style="color:green">L'état a bien été modifié</h5>`;
      } catch (err) {
        console.error("FurnitureAdmin::Change condition", err);
        PrintError(err);
      }

    }
    
}

const onCheckOption = async() => {

  let option = await callAPI(API_BASE_URL + furniture.id + "/option", "GET");
  let optionDocument = document.querySelector("#option");
  console.log(option);
  if(option.status != undefined && option.status == "en_cours") {
    optionDocument.innerHTML = isOption;
    let userOption = document.querySelector("#userOption");
    userOption.innerHTML = furniture.buyer.email;
    let btn = document.querySelector("#btnOption")
    btn.addEventListener("click", onClickCancelOption);
  }else{
    optionDocument.innerHTML = noOption;
  }


}

const onClickCancelOption = async (e) => {
  e.preventDefault();
  let optionDocument = document.querySelector("#option");
  try {
    let user = getUserSessionData();
    await callAPIWithoutJSONResponse(API_BASE_URL_ADMIN + furniture.id + "/cancelOption", "PUT",user.token);
    optionDocument.innerHTML = noOption;
    try {
      furniture = await callAPI(API_BASE_URL + furniture.id , "GET",undefined);
    } catch (err) {
      console.error("FurnitureAdmin::GetFurnitureByID", err);
      PrintError(err);
    }
    let optionCondition = document.querySelector("#"+furniture.condition);
    optionCondition.setAttribute("selected","");
  } catch (e) {
    console.log(e);
    PrintError(e);
    //Erreur
  }
}


export default FurnitureAdmin;