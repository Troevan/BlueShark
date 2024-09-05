import base64
import functools
import operator
obfuscated = base64.b64encode(b" 1 + 1").decode()
decoded = base64.b64decode(obfuscated)
output = "".join([chr(ord(char) ^ 0) for char in decoded.decode()])
result = list(map(lambda x: chr(ord(x) + 0), output))
final = functools.reduce(operator.add, result)
reversed_final = final[::-1]
unreversed = reversed_final[::-1]
encoded = base64.b64encode(unreversed.encode()).decode()
decoded_again = base64.b64decode(encoded).decode()
print(eval(f"f'{decoded_again}'"))
