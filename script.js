//model to retrieve data
function salesModel(){
  var self        =this;
  //given url, get json data, parse each sales object into productobj and push into products variable
  //after parsing, run callback or return products
  self.getproducts = function(url,callback){
    var products = [];
    $.getJSON(url, function(response){
        for(i=0; i<response.sales.length ; i++){
          products.push( new productobj(response.sales[i], i)  );
        }
    }).done(function(){
      if(typeof callback === 'function'){
        callback(products);
      }
      else{
        return products;
      }
    });
  }
}

//all DOM manipulations
function domUpdate(){
  var self      =this;

  //combined updateproducthtml and updatehtml
  self.updateproducthtml = function(products){
    products[0].getTemplate(function(template){
      $('#loading').toggleClass('hidden');
      thishtml='';
      for( i=0; i< products.length ; i++){
        $('#content').append(products[i].updatehtml(template));
      }
      $('#loading').toggleClass('hidden');
    });
  }
}

//product object
function productobj(product, i){
  var self          = this;
  self.photo        = product.photos.medium_half
  self.title        = product.name
  self.tagline      = product.tagline
  self.description  = product.description
  self.url          = product.url
  self.htmlview     = ""
  self.index        = i
  self.custom_class = "col-md-4"

  //create and fill in html snippet for this
  self.updatehtml= function(template){
      return template.replace('{image}', self.photo).replace('{title}', self.title).replace('{tagline}', self.tagline).replace('{description}', self.description).replace('{url}', self.url).replace('{custom_class}', self.custom_class);
  }

  //get template unique to products
  //after getting template, run callback or return template
  self.getTemplate= function(callback){
    $.get('product-template.html', function(template){
      //if there is a callback function
      if(typeof callback === 'function'){
        callback(template);
      }
      else{
        return template;
      }
      
    });
  }
}

//remove product item functionality
$(document).on('click','.product-remove',function(){
  //fadeout transition for product
  $(this).parent().parent().fadeOut(300, function() {
    //completely remove product from DOM
    $(this).remove();
  });
});

var sales = new salesModel();
var page = new domUpdate();

sales.getproducts('data.json',page.updateproducthtml);
