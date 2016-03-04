(function (exports) {
  "use strict";

  
  function GridRowView() {
    
    Events.call(this, ['loadComplete', 'back', 'transitionUp', 'select']);

    this.currSelection = 0;
    this.rowSelection = null;
    this.rowSelection = 0;

    this.render = function($el){

      var html = utils.buildTemplate($("#grid-row"), {});

      $el.append(html);

      this.setUpTheRow(this.rowSelection, this.currSelection); 

    };

    this.transitionUp = function(){
      
      $('.innerLargeBrowseContainer').animate({marginTop: '+=620px'});
            

    };

    this.highLight = function(){

      $(this.kids[this.currSelection]).addClass("orangeBorder");
    };

    this.setUpTheRow = function(rowNumber){

        this.kids = $(".innerGridRow:eq("+rowNumber+")").find('img');
        
        this.gridrowLength = this.kids.length;

        this.addedGridrowLength = this.gridrowLength + 1;

        $(".innerGridRow").css('width', (this.addedGridrowLength*350) + "px");

        $(this.kids[0]).css('margin-left',  '16px' ); 

        

    } ;  
   
    this.handleControls = function (e) {

          if (e.type === 'buttonpress')
           {
            switch (e.keyCode) 
            {

            case buttons.SELECT:
            case buttons.PLAY_PAUSE:
              this.trigger('select');
              break;
            case buttons.BACK:
                this.trigger("back");
              break;
            case buttons.UP:          
             
              if(this.rowSelection === 0){

                $(this.kids[this.currSelection]).removeClass("orangeBorder"); 
              	 this.trigger('transitionUp');
              	  
              }
              else{
                this.rowSelection--;

                $('.innerLargeBrowseContainer').animate({marginTop: '+=620px'});

                $(this.kids[this.currSelection]).removeClass("orangeBorder");

                this.currSelection = 0;

                this.setUpTheRow(this.rowSelection);

                this.highLight();

              }
              
              break;
            case buttons.DOWN:

              var numGridRows = $('.gridRow').length;             

              if(this.rowSelection < numGridRows - 1){

                 this.rowSelection++;

                $('.innerLargeBrowseContainer').animate({marginTop: '-=620px'});

                $(this.kids[this.currSelection]).removeClass("orangeBorder");

                this.currSelection = 0;

                this.setUpTheRow(this.rowSelection);

                this.highLight();  

              }                              

              break;

            case buttons.LEFT:

              if (this.currSelection > 0){

                if(this.currSelection > 3) {

                $(this.kids[0]).css('margin-left',  '+=342px' );

                $(this.kids[this.currSelection]).removeClass("orangeBorder");

                this.currSelection--;

                $(this.kids[this.currSelection]).addClass("orangeBorder");

                return;

              }

               $(this.kids[this.currSelection]).removeClass("orangeBorder");           

               this.currSelection--;
                
               $(this.kids[this.currSelection]).addClass("orangeBorder");
               
              }              

            break;       

            case buttons.RIGHT:

            if(this.currSelection < this.gridrowLength -1){

                if(this.currSelection > 2) {

                  $(this.kids[0]).css('margin-left',  '-=342px' );

                  $(this.kids[this.currSelection]).removeClass("orangeBorder");

                  this.currSelection++;

                  $(this.kids[this.currSelection]).addClass("orangeBorder");

                  return;

                }

                 $(this.kids[this.currSelection]).removeClass("orangeBorder");

                 this.currSelection++;

        	     $(this.kids[this.currSelection]).addClass("orangeBorder");

            }

              break;
            }
          }

         
        }.bind(this);

      

     }

  exports.GridRowView = GridRowView;
}(window));