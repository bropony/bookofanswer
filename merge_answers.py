import json

# Merge buddhist
with open('public/answers/buddhist.json') as f:
    data = json.load(f)
main_answers = data if isinstance(data, list) else data.get('answers', [])
with open('public/answers/buddhist_new.json') as f:
    data2 = json.load(f)
new_answers = data2 if isinstance(data2, list) else data2.get('answers', [])
merged = main_answers + new_answers
print(f"Buddhist: {len(main_answers)} + {len(new_answers)} = {len(merged)}")
with open('public/answers/buddhist.json', 'w', encoding='utf-8') as f:
    json.dump({"answers": merged}, f, ensure_ascii=False, indent=2)

# Merge confucian
with open('public/answers/confucian.json') as f:
    data = json.load(f)
main_answers = data if isinstance(data, list) else data.get('answers', [])
with open('public/answers/confucian_part2.json') as f:
    data2 = json.load(f)
new_answers = data2 if isinstance(data2, list) else data2.get('answers', [])
merged = main_answers + new_answers
print(f"Confucian: {len(main_answers)} + {len(new_answers)} = {len(merged)}")
with open('public/answers/confucian.json', 'w', encoding='utf-8') as f:
    json.dump({"answers": merged}, f, ensure_ascii=False, indent=2)

# Merge metaphysical
with open('public/answers/metaphysical.json') as f:
    data = json.load(f)
main_answers = data if isinstance(data, list) else data.get('answers', [])
with open('public/answers/metaphysical_new.json') as f:
    data2 = json.load(f)
new_answers = data2 if isinstance(data2, list) else data2.get('answers', [])
merged = main_answers + new_answers
print(f"Metaphysical: {len(main_answers)} + {len(new_answers)} = {len(merged)}")
with open('public/answers/metaphysical.json', 'w', encoding='utf-8') as f:
    json.dump({"answers": merged}, f, ensure_ascii=False, indent=2)

print("All merges complete!")
