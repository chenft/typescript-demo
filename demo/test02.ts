function buildName(firstName: string, lastName?: string): string {
  if (lastName) return firstName + ' ' + lastName;
  else return firstName;
}

let result1 = buildName('Bob'); // works correctly now
let result3 = buildName('Bob', 'Adams'); // ah, just right
console.log(result1);
console.log(result3);

let xcatliu: [string, number];
xcatliu = ['Xcat Liu', 25];
xcatliu.push('http://xcatliu.com/');
xcatliu.push(3);
xcatliu.push('3');
xcatliu.push(true);
