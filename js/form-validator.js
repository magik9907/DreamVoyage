(function(){
	"use strict";
	
	/*
		Walidacja pól:
		1) imię i nazwisko:
			a) czy nie jest puste
			b) czy wpisane imię i nazwisko

		2) email:
			a) czy nie jest puste
			b) czy jest to poprawny adres e-mail

		3) telefon
			a) tylko liczby i +
			b) przynajmniej 11 cyfr +XX XXX XXX XXX

		4) powod kontaktu;
			a)  zaznaczone obowiazkowe

		5) czy jest klientem
			a) zaznaczone
			
		6) dzien kontaktu
			a) przynajmniej 2 maks 4

		7) wiadomosc
		 a) pole nie jest puste
		 b) przynjamniej 5 maks 200 liter


		8) Wszystkie zgody są wymagane

		Walidacja pól odbywała się:
			1) Po zmianie w polu
			2) Po kliknięciu w przycisk submit
	*/
	
	const $form = document.querySelector(".contact-form");	


	var settings ={
		formName:'contact',
		letterCount:'letters-count',
		checkbox:{
			day:'day[]'
		}
	};


	var validationRules = {
		name:{
			required:{
				target: 'notBlank',
				message:'pole nie może być puste'
			},

			isFullName:{
				target: 'regex',
				regex:/^[a-zA-Z]+ [a-zA-Z]+$/,
				message:'Pole składa sie z imienia i nazwiska'
			}

		},

		email:{
			required:{
				target: 'notBlank',
				message:'pole nie może być puste'
			},

			isEmail:{
				target:'regex',
				regex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				message:'Email jest nie poprawny'
			}
		},


		tel:{
			isPhone:{
				target:'regex',
				regex:/(?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w)/,
				message:'numer telefonu jest niepoprawny'
			}
		},

		select:{
			required:{
				target: 'notBlank',
				message:'wybierz opcje'
			},

		},

		client:{
			isClient:{
				target: 'radio',
				message:'wybierz opcje'
			},

		},
		
		day:{
			howManyChecked:{
				target:'count',
				min:2,
				minMessage:'Zaznacz przynajmniej 2',
				max:4,
				maxMessage:"maksymalnie mozesz zaznaczyc 4"
			}

		},

		text:{
			required:{
				target: 'notBlank',
				message:'Pole jest obowiązkowe'
			},

			length: {
				target:'length',
				min:5,
				minMessage:'dlugosc minimalna 5 liter',
				max:200,
				maxMessage:'dlugosc maksymalna 200 liter'
			}
		},

		status:{
			required:{
				target:'checked',
				message:'Potwierdż, że zapoznałeś/aś z regulaminem'
			}
		}
		
	};

	var validation = {
		notBlank:function($f, rules){
			return ($f[0].value==false)?rules.message:false;
		},

		count: function($f,rules){
			var c=0;
			for(let i=0, l=$f.length;i<l;i++){
				if($f[i].checked)c++;
			}

			if(c<rules.min){
				return rules.minMessage;
			}else if(c>rules.max){
				return rules.maxMessage;
			}
			return false;
			
		},

		regex: function($f, rules){
			var regex = rules.regex;
			return (regex.test($f[0].value))?false:rules.message;
		},

		length: function($f, rules){
			var content = $f[0].value;
			content= content.replace(/\s/g,'')

			var length = content.length;

			var $letterCount = $form.querySelector('.'+settings['letterCount']+'  .letter');
			
			$letterCount.innerHTML = length;
			
			if(length<rules.min){
				$letterCount.classList.remove('green');
				return rules.minMessage;
			}else if(length>rules.max){
				$letterCount.classList.remove('green');
				return rules.maxMessage;
			}
			$letterCount.classList.add('green');

			return false;

		},

		radio: function($f, rules){
			for(let i=0, l=$f.length;i<l;i++){
				if($f[i].checked)
					return false;
			}
			return rules.message;
			
		},

		checked:function($f, rules){
			return (!$f[0].checked)?rules.message:false;
		},

	};


	var getTypeName = function(t){
		return t.replace('contact',"").replace(/[\[\]]/g,"");
	}

	var getFieldFullName = function(formName, fieldname){
		return (settings['checkbox'][fieldname])? formName+'['+fieldname+'][]':formName+'['+fieldname+']';

	}

	var getInputRow=function($field){
		do{
			$field=$field.parentNode;
		}while(!$field.classList.contains('input-row'))
		return $field;
	}

	var clearMessage = function($field){
		var $errList = getInputRow($field);
		$errList = $errList.querySelector('.err-list');
		if($errList)
			$errList.remove();
	}

	var createElement = function(element , classes='', content=''){
		var frag = document.createElement(element);
		frag.appendChild(document.createTextNode(content));
		frag.setAttribute('class',classes);

		return frag;
	}

	var genMessage = function($field, message){
		var ul= createElement('ul','err-list');

		for (let i = 0; i < message.length; i++) {
			ul.appendChild(createElement('li','',message[i]));
		}

		$field.appendChild(ul);
	}

	var addClass = function($f , classes){
		$f.classList.add(classes);
	}
	
	var clearMarks = function ($f){
		$f.classList.remove('valid');
		$f.classList.remove('invalid');
	}

	var doValidate = function ($fields,rules){
		clearMarks($fields[0]);
		clearMessage($fields[0]);
		var message = new Array;
		for(let x in rules){
			var m = validation[rules[x].target]($fields, rules[x])
			
			if(m){
				message.push(m);
			}
		}
		
		if(message.length !== 0){
			addClass($fields[0], 'invalid');
			genMessage(getInputRow($fields[0]),message);
			return false;
		}else{
			addClass($fields[0], 'valid');
			return true;
		}
	}
	
	var onChangeValid = function (e){
		var name = getTypeName(e.target.name);
		var $fields = $form.querySelectorAll('[name="'+e.target.name+'"]');
		var rules = validationRules[name];
		
		if(rules){
			doValidate($fields, rules);
		}
	}

	var onSumbit = function (e){
		var isValidate = true;
		var $fields = null;
		for(var x in validationRules){
			$fields= $form.querySelectorAll('[name="'+getFieldFullName(settings['formName'],x)+'"');
			
			
			let is = doValidate($fields, validationRules[x]);
			
			if (!is){
				isValidate = false;
			}
		}
		
		if(!isValidate){
			e.preventDefault();
		}
	}

	$form.addEventListener('blur',onChangeValid,true);
	$form.addEventListener('change',onChangeValid,false);
	$form.addEventListener('submit',onSumbit,false);
	
})();
