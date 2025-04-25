const fs = require("fs");

// Lagrange interpolation to find f(0)
function lagrangeInterpolation(points) {
    let result = 0n;

    for (let i = 0; i < points.length; i++) {
        let xi = BigInt(points[i][0]);
        let yi = BigInt(points[i][1]);

        let numerator = 1n;
        let denominator = 1n;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let xj = BigInt(points[j][0]);
                numerator *= -xj;
                denominator *= (xi - xj);
            }
        }

        result += (yi * numerator) / denominator;
    }

    return result;
}

// Reads input JSON, decodes points, and calculates secret
function findSecret(filePath) {
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const k = json.keys.k;

    const points = [];

    for (const key in json) {
        if (key === "keys") continue;

        const x = parseInt(key);
        const base = parseInt(json[key].base);
        const valueStr = json[key].value;
        const y = parseBigIntFromBase(valueStr, base);

        points.push([x, y]);
    }

    points.sort((a, b) => a[0] - b[0]);

    const selected = points.slice(0, k);
    return lagrangeInterpolation(selected);
}

// Supports large base conversion with BigInt
function parseBigIntFromBase(str, base) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = 0n;

    for (let i = 0; i < str.length; i++) {
        const digit = BigInt(chars.indexOf(str[i].toLowerCase()));
        if (digit >= BigInt(base)) {
            throw new Error(`Invalid digit '${str[i]}' for base ${base}`);
        }
        result = result * BigInt(base) + digit;
    }

    return result;
}

// Run both test cases
const secret1 = findSecret("testcase1.json");
const secret2 = findSecret("testcase2.json");

console.log("Secret 1:", secret1.toLocaleString("en-US"));
console.log("Secret 2:", secret2.toLocaleString("en-US"));
