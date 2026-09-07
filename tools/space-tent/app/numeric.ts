/** Small arithmetic parser: no evaluation of JavaScript, finite real answers only. */
export function numericValue(input:string):number|null{
 const s=input.trim().replaceAll(',','.').replaceAll('×','*').replaceAll('·','*').replaceAll('÷','/').replaceAll('²','^2').replaceAll('³','^3').replaceAll('−','-').replaceAll('π','pi').replaceAll('√','sqrt').replace(/\s+/g,'');
 if(!s||s.length>120)return null;
 const tokens=s.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|sqrt|pi|[()+\-*/^]/g)||[];
 if(tokens.join('')!==s||tokens.length>80)return null;
 let i=0;
 function atom():number{const t=tokens[i++];if(t==='('){const v=sum();if(tokens[i++]!==')')throw Error();return v}if(t==='sqrt')return Math.sqrt(atom());if(t==='pi')return Math.PI;if(t&&/^(\d|\.)/.test(t))return Number(t);throw Error()}
 function power():number{const v=atom();return tokens[i]==='^'?(i++,v**unary()):v}
 function unary():number{if(tokens[i]==='+'){i++;return unary()}if(tokens[i]==='-'){i++;return -unary()}return power()}
 function product():number{let v=unary();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],b=unary();v=op==='*'?v*b:v/b}return v}
 function sum():number{let v=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],b=product();v=op==='+'?v+b:v-b}return v}
 try{const value=sum();return i===tokens.length&&Number.isFinite(value)?value:null}catch{return null}
}
