  //dối tượng
  function Validator(options){
    function getParent(element,selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }

    }


    var selectorRules={};
    // Hàm thực hiện xác thực lỗi
    function validate(inputElement,rule){

        var errorMesssage ;
        var errorElement=getParent(inputElement,options.formGroupSelector).querySelector(options.erorrSelector);
       
        // lấy ra các rules của selector
        var rules=selectorRules[rule.selector] ;

        // lặp qua các rules và kt
        // có lỗi dừng
        for(var i=0;i,rules.length;i++){
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':
                    errorMesssage=rules[i](
                        formElement.querySelector(rule.selector+':checked'),
                    );
                    break;
                default:
                    errorMesssage=rules[i](inputElement.value);
            }
            if(errorMesssage) break ;
           
        }
        
         if(errorMesssage ){
          errorElement.innerText = errorMesssage;
          getParent(inputElement,options.formGroupSelector).classList.add('invalid');
         } else{
          errorElement.innerText='';
          getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
         }
         return !errorMesssage;

    }
    // lấy elemenr của form cần xác thực
    var formElement = document.querySelector(options.form)
    if(formElement){
        formElement.onsubmit=function(e){
            e.preventDefault();
               
             var isFormValid=true;     

            //thực hiện lặp qua các rules và validate
            options.rules.forEach(function(rule){
                var inputElement=formElement.querySelector(rule.selector);
                 
                var isValid =validate(inputElement,rule);
               if(!isValid){
                isFormValid=false;
               }
            });
            

            if(isFormValid){
             if(typeof  options.onSubmit==='function'){

                 var enableInput=formElement.querySelectorAll('[name]:not([disable]')
                
                var formValues=Array.from(enableInput).reduce(function(values,input){
                    values[input.name]=input.value;
                    return  values;
                
                },{});
            
                options.onSubmit(formValues);

                  }
            }
        }




        // lặp qua mỗi rules và xử lý (lắng nghe  sự kiện blur,input,....)
        options.rules.forEach(function(rule ){
            //lưu các rules cho các input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] =[rule.test];

            }
                var inputElements =formElement.querySelectorAll(rule.selector);
                
                Array.form(inputElements).forEach(function(inputElement){
                        // xử lý blur ra khỏi input
                    inputElement.onblur = function(){
                       validate(inputElement,rule);
                    }
                    // xử lý khi ng dùn nhập vào input
                    inputElement.oninput = function(){
                        var errorElement=getParent(inputElement,options.formGroupSelector).querySelector(options.erorrSelector);
                        errorElement.innerText='';
                        getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
    
                    }
                
                });        
        });
    }
}
// Định nghĩa rules
// nguyên tắc các rule
// có lôi => trả mess lỗi
// hợp lệ =>undifine
Validator.isRequired = function(selector,message){
       return{
        selector: selector,
        test:function(value){
            return value ? undefined :message ||'Vui Lòng Nhập Trường Này!!!'


        }
       }
}
Validator.isEmail=function(selector,message){
        return{
             selector: selector,
             test:function(value){
                    var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return regex.test(value) ? undefined :message ||'Trường này phải là  email'
             }
            }
}
Validator.minLength=function(selector,min,message){
    return{
         selector: selector,
         test:function(value){
                
                return value.length >= min ? undefined :message ||`Vui lòng nhập tối thiểu ${min} kí tự`
         }
        }
}
Validator.isConfirmed=function(selector,getConfirmValue,message) {
    return{
        selector: selector,
        test:function(value){
            return value === getConfirmValue?undefined : message ||'Giá trị nhập vào không chính xác!!!'
        }
    }

}

