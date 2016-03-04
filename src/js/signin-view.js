(function (exports) {
  "use strict";

 
  function SignInView() {
    
    var focused = "emailInput";

    Events.call(this, ['select', 'switchingInput', 'back', 'pwSubmit', 'devicelinking']);  

    this.currSelection = 0;
     var tt, EI;
     this.view = "input";

     this.render = function ($el) {
       var html = fireUtils.buildTemplate($("#signInView"), {});

       $el.append(html);
       
       $(".emailInput").addClass("orangeBorder"); 
      

      var emailInput = document.getElementsByClassName("emailInput");
              emailInput[0].addEventListener("change", function(e){             
              console.log("email change");
              $(".emailInput").blur();
              $(".emailInput").removeClass("orangeBorder");
              $(".passwordInput").addClass("orangeBorder");
          });

          var pwInput = document.getElementsByClassName("passwordInput");
          pwInput[0].addEventListener("change", function(e){
              if(emailInput[0].value !== null){
                 //app.signinView.trigger("pwSubmit");
                 return;
              }
             
          });
       
    };

    this.selectInput = function(){

      if($(".signupButton").hasClass("orangeBorder")){
        $("#signinContainer").hide();
        //$(".deviceLinkingImg").show();
        this.trigger('devicelinking');
        return;
      }


      if($(".cancelButton").hasClass("orangeBorder")){
          this.trigger("back");
          return;

        }

      if ($(".emailInput").hasClass("orangeBorder")){          
          $(".emailInput").focus();
          
          buttons.resync();
          return;
        }
        if ($(".passwordInput").hasClass("orangeBorder")){
           if ($(".emailInput").is(":focus")){
            console.log("EMAILFOCUS");
           }
           //$(".emailInput:focus").blur();
          $(".passwordInput").focus(); 
           buttons.resync();
          return;

        } 
        

    };

    this.hideaway = function(){
      $("#signinContainer").hide();
    };
    

    this.checkIfRegister = function(){

      if($(".signUpButton").hasClass("signUpButtonBorder")){
       // console.log("true");
        return true;
      }
      else{
        //console.log("false");
        return false;
      }

    };
    

    this.handleControls = function (e) { 

      if(this.view === "input"){

            if (e.type === 'buttonpress') 
            {
              switch (e.keyCode) {

              case buttons.SELECT:         
              case buttons.PLAY_PAUSE:

                this.trigger("select");                
                
                break;

              case buttons.BACK:
                this.trigger("back");
                console.log("BACK");
                break;

              case buttons.UP:
                if ($(".passwordInput").hasClass("orangeBorder")){
                  $(".passwordInput").blur();
                   $(".passwordInput").removeClass("orangeBorder");
                   $(".emailInput").addClass("orangeBorder");
                  
                 }      

                break;        
              case buttons.DOWN:
               if ($(".emailInput").hasClass("orangeBorder")){
                $(".emailInput").blur();
                $(".emailInput").removeClass("orangeBorder");
                $(".passwordInput").addClass("orangeBorder");
                return;
              }
              if ($(".passwordInput").hasClass("orangeBorder")){
                 $(".passwordInput").blur();
                 $(".passwordInput").removeClass("orangeBorder");
                 $(".signupButton").addClass("orangeBorder");
                 this.view = "buttons";
               }                
                
               break;
              
              case buttons.LEFT:
             
               
                break;

              case buttons.RIGHT:
             
                
                break;

              }
            } 
            
      }
      else if (this.view === "buttons"){

          if (e.type === 'buttonpress') 
            {
              switch (e.keyCode) {

              case buttons.SELECT:         
              case buttons.PLAY_PAUSE:
                this.trigger("select");
                
                break;

              case buttons.BACK:
                this.trigger("back");
                break;

              case buttons.UP: 
                $(".passwordInput").addClass("orangeBorder");
                $(".signInButtons").children().removeClass("orangeBorder");
                this.view= "input";
                break;        
              case buttons.DOWN:              
                
               break;
              
              case buttons.LEFT:
                if ($(".signupButton").hasClass("orangeBorder")){
                  $(".cancelButton").addClass("orangeBorder");
                   $(".signupButton").removeClass("orangeBorder");
                }
                else{
                  $(".signupButton").addClass("orangeBorder");
                  $(".cancelButton").removeClass("orangeBorder");
                }
               
                break;

              case buttons.RIGHT:
                if ($(".signupButton").hasClass("orangeBorder")){
                $(".cancelButton").addClass("orangeBorder");
                 $(".signupButton").removeClass("orangeBorder");
                }
                else{
                  $(".signupButton").addClass("orangeBorder");
                  $(".cancelButton").removeClass("orangeBorder");
                }
                
                break;            

              }
            } 

      }
    }.bind(this);

  }

  exports.SignInView = SignInView;
}(window));