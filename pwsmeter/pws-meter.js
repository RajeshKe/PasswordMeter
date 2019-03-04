import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `pws-meter`
 * Password strength meter
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PwsMeter extends PolymerElement {
    static get template() {
      return html`   
      <style>
          .score1 { background-color:gray; width:10%; }
          .score2 { background-color:red;  width:25%; }
          .score3 { background-color:yellow; width:50%; }
          .score4 { background-color:blue; width:75%; }
          .score5 { background-color:green; width:95%; }
          .meterouterdiv { width:100%; margin-top:8px; height:10px; background-color:#ddd; }
          .custom_msg { font-size:14px; color:black; }
          .info_icon { float:right; color:red; border:1px solid red; }
      </style>
      <div style="margin-top:10px;width:100%;">
          <div class="custom_msg">[[dynamicmsg]]
            <span class="info_icon" title$="{{iconmessage}}" style$="{{showinfo}}">icon[[rangecolors.one]]</span>
          </div>
          <div class="meterouterdiv">
              <div class$="{{indicatorcolor}}" style="height:100%;"></div>
          </div>
      </div>`;
    }
    
  static get properties() {
      return {
          mypassword:     { type: String, value:'', observer: '_dynamicPassword' },
          customsg:       { type:String, value:'', /*observer:'_CustomText'*/ },
          passwordscore:  { type: Number, value:'' },
          msgcolor:       { type:String, value:'' },
          dynamicmsg:     { type: String, value:'' },
          indicatorcolor: { type: String, value:'' },
          strengthrange:  { type:String, value:'' },
          rangecolors:    { type:Object, value:'' },
          infoicon:       { type:String, value:'' }, 
          iconmessage:    { type:String, value:'' },
          showinfo :      { type:String, value:''}

      }
  }

  checkPasswordFun(pass) { 
    
      let score = 0;
      if (!pass) {
          return score;
      }

      // award every unique letter until 5 repetitions
      let letters = new Object();
      for (var i=0; i<pass.length; i++) {
          letters[pass[i]] = (letters[pass[i]] || 0) + 1;
          score += 5.0 / letters[pass[i]];
      }

      // bonus points for mixing it up
      let variations = {
          digits: /\d/.test(pass),
          lower: /[a-z]/.test(pass),
          upper: /[A-Z]/.test(pass),
          nonWords: /\W/.test(pass),
      }

      let variationCount = 0;
      for (var check in variations) {
          variationCount += (variations[check] == true) ? 1 : 0;
      }
      score += (variationCount - 1) * 10;

      return parseInt(score);
      
  }

  _dynamicPassword(password) {  
      if(password!='' && password!='undefined' && password.length>0) { 
          
        let finalscore = this.checkPasswordFun(password);
       
        if (finalscore > 80) {
              //password strong section here.
              this.passwordscore = 5;
              this.dynamicmsg = "Your Password is Strong";
        }else if (finalscore > 60) {
            //password good section here.
              this.passwordscore = 4;
              this.dynamicmsg = "Your Password is Good";
        } else if(finalscore > 45){
            //password fair section here.
              this.passwordscore = 3;
              this.dynamicmsg = "Your Password is Fair";
        } else if (finalscore >= 30) {
            //password weak section here.
              this.passwordscore = 2;
              this.dynamicmsg = "Your Password is Weak";
        } else {
            //password to short section here.
              this.passwordscore = 1;
              this.dynamicmsg = "Your Password is Too Short";
        }
        this.indicatorcolor = "score"+this.passwordscore;

        if(this.customsg!='' && this.customsg.length>0 && this.customsg!='undefined') {
            this.dynamicmsg = this.customsg;
        } 

        if(this.infoicon=='enable') { this.showinfo = "display:block;" } else { this.showinfo = "display:none;" }

        if(this.iconmessage=='' || this.iconmessage=='undefined') {
            this.iconmessage = "Dynamic icon message comes here";
        }

        if(this.rangecolors!='') {
            console.log(this.rangecolors.one)
            /*for(let colordata in this.rangecolors) {
                console.log(colordata);
            }*/
        }
      }
            
  }

  /*_CustomText(newmsg) {
      console.log("new custom message===="+newmsg);
      
  }*/
}

window.customElements.define('pws-meter', PwsMeter);
