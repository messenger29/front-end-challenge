
function domobj(){
  var self        =this;
  self.products   = [];

  //given url, get json data, parse each sales object into productobj and push into products variable
  self.getproducts = function(url){
    $.getJSON(url, function(response){
        for(i=0; i<response.sales.length ; i++){
          self.products.push( new productobj(response.sales[i], i)  );
        }
    });
  }
    
  //goes through each product and call updatehtml to create html snippet for it
  self.updateproducthtml = function(){
    for( i=0; i< self.products.length ; i++){
      self.products[i].updatehtml();
    }
  }
  
  self.updatedom = function(){
    var i=0
    thishtml='';
    for( i=0; i< self.products.length ; i++){
      thishtml += self.products[i].htmlview;
    }
    $("#content").append(thishtml)  //print to html
  }
  
}

//parse product object
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
  self.updatehtml= function(){
    $.get('product-template.html', function(template){
      self.htmlview = template.replace('{image}', self.photo).replace('{title}', self.title).replace('{tagline}', self.tagline).replace('{description}', self.description).replace('{url}', self.url).replace('{custom_class}', self.custom_class);
    });
  }
}

//remove product item
$(document).on('click','.product-remove',function(){
  //fadeout transition for product
  $(this).parent().parent().fadeOut(300, function() {
    //completely remove product from DOM
    $(this).remove();
  });
});

var page=new domobj();
page.getproducts('data.json');
setTimeout("console.log('building html');page.updateproducthtml();",100); //changed timeout value from 20 to 100 b/c getproducts taking longer
setTimeout("page.updatedom()",200)  //changed timeout value from 50 to 200 to go last
