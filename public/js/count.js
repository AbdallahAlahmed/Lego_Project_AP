let savedCount;

const saveCount = () => {
    const inputElement = document.getElementById("numberInput");
    savedCount = Number(inputElement.value);
    let number = savedCount;
    console.log("new", number);
    console.log("Saved your count", savedCount)
}

