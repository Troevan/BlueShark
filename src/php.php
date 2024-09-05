<?php
$obfuscated = base64_encode(" 1 + 1");
$decoded = str_split(base64_decode($obfuscated));
$output = "";
for ($i = 0; $i < count($decoded); $i++) {
    $output .= chr(ord($decoded[$i]) ^ 0);
}
$result = array_map(function($char) {
    return chr(ord($char) + 0);
}, str_split($output));
$final = implode("", $result);
eval('echo "' . addslashes($final) . '";');
?>

#!/bin/bash
message=$(echo " MSArIDEK" | base64 -d)
for ((i=0; i<${#message}; i++)); do
    char="${message:$i:1}"
    ascii=$(printf "%d" "'$char")
    ((ascii ^= 0))
    printf \\$(printf "%03o" "$ascii")
done
echo

import base64
import functools
obfuscated = base64.b64encode(b" 1 + 1").decode()
decoded = base64.b64decode(obfuscated)
output = "".join([chr(ord(char) ^ 0) for char in decoded.decode()])
result = list(map(lambda x: chr(ord(x) + 0), output))
final = functools.reduce(lambda x, y: x + y, result)
exec(f'print("{final}")')
