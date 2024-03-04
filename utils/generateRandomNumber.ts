const generateRandomNumber = (n:number) =>{
  return ("" + Math.random()).substring(2, n+2)
}

export default generateRandomNumber