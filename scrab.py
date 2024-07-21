import requests
from bs4 import BeautifulSoup
import re


def scrape_recipe(url):
    response = requests.get(url)
    # print(response)
    soup = BeautifulSoup(response.text, 'html.parser')
    # Extract ingredients, steps, etc.
    ingredients = soup.find_all(class_='ingredient')
    
    # Define the regex patterns for the class names
    wrapper_pattern = re.compile(r'^Wrapper-')
    basewrap_pattern = re.compile(r'^BaseWrap-')

    # Find all divs with class names that match the wrapper pattern
    wrapper_divs = soup.find_all('div', class_=wrapper_pattern)

    # For each wrapper div, find all nested basewrap divs
    basewrap_divs = []
    for wrapper in wrapper_divs:
        basewrap_divs.extend(wrapper.find_all('div', class_=basewrap_pattern))

    # Extract the text content from the matched basewrap divs
    basewrap_texts = [basewrap.get_text(strip=True) for basewrap in basewrap_divs]

    print(basewrap_texts)
    return ingredients, basewrap_texts


recipe_urls = ['https://www.epicurious.com/recipes/food/views/baby-beet-salad-106728']
recipes = [scrape_recipe(url) for url in recipe_urls]

# print(recipes)