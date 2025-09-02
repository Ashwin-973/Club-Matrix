import requests
import json
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import ssl
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

COLLEGE_CLUBS_URL = "https://www.snuchennai.edu.in/clubs/"

HEADERS = {
     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.7",
    "cache-control": "max-age=0",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Brave\";v=\"139\", \"Chromium\";v=\"139\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "sec-gpc": "1",
    "upgrade-insecure-requests": "1",
    "cookie": "npfwg=1; npf_r=https://www.google.com/; npf_l=www.snuchennai.edu.in; npf_u=https://www.snuchennai.edu.in/; cf_clearance=9OqhQByiFzmTOAKomUrXwX7GyYrfM1Af9NFFC.wPsQ8-1756799035-1.2.1.1-29jH3OdLVFZUx9SPX5ibYPo43z3K71xDefvp4A8edL7JawzdKBSAonLUieAiLyOaB2m4G6b.iHxeoQmYpGjpFOXUF_KXP0G835hUN16kvnyag.wkKoQ0CGap_zB8StD6DNlhnOqPZdO_VAl6Y.AZkOLuZAUbKOySsMR4nHni8GQ6DREjcir9foIlP8z5APcHDGhehEM50vDJeIR_6O9CZgjWuSuRP22tQi2IBIgFKOY"
}
CATEGORY_KEYWORDS = {
    'Academic': [
        'academic', 'study', 'research', 'science', 'engineering', 'math', 'mathematics',
        'physics', 'chemistry', 'biology', 'computer', 'debate', 'mun', 'model', 'united',
        'nations', 'quiz', 'programming', 'coding', 'robotics', 'scholar', 'honor',
        'society', 'pre-med', 'pre-law', 'business', 'economics', 'finance', 'accounting',
        'psychology', 'philosophy', 'literature', 'writing', 'journalism', 'newspaper',
        'magazine', 'publication', 'editor', 'tutoring', 'mentor'
    ],
    'Arts & Culture': [
        'art', 'music', 'dance', 'theater', 'theatre', 'drama', 'film', 'cinema',
        'photography', 'painting', 'drawing', 'sculpture', 'creative', 'cultural',
        'heritage', 'tradition', 'choir', 'band', 'orchestra', 'instrument', 'sing',
        'performance', 'gallery', 'museum', 'exhibition', 'poetry', 'literature',
        'fashion', 'design', 'multimedia', 'video', 'animation', 'graphic'
    ],
    'Sports & Recreation': [
        'sport', 'athletic', 'fitness', 'gym', 'workout', 'exercise', 'running',
        'swimming', 'basketball', 'football', 'soccer', 'tennis', 'volleyball',
        'baseball', 'hockey', 'golf', 'track', 'field', 'martial', 'yoga',
        'recreation', 'outdoor', 'hiking', 'camping', 'adventure', 'cycling',
        'climbing', 'skiing', 'surfing', 'intramural', 'competition', 'tournament'
    ],
    'Service & Community': [
        'service', 'volunteer', 'community', 'charity', 'nonprofit', 'help',
        'support', 'outreach', 'social', 'justice', 'advocacy', 'awareness',
        'fundraising', 'donation', 'homeless', 'environment', 'sustainability',
        'green', 'conservation', 'mentor', 'tutor', 'teach', 'education',
        'hospital', 'medical', 'health', 'food', 'kitchen', 'shelter',
        'humanitarian', 'mission', 'relief', 'development'
    ],
    'Religious & Spiritual': [
        'religious', 'spiritual', 'faith', 'christian', 'catholic', 'protestant',
        'jewish', 'muslim', 'islamic', 'hindu', 'buddhist', 'interfaith',
        'ministry', 'worship', 'prayer', 'bible', 'church', 'synagogue',
        'mosque', 'temple', 'fellowship', 'devotion', 'meditation', 'chaplain'
    ],
    'Professional & Career': [
        'professional', 'career', 'internship', 'networking', 'industry',
        'business', 'entrepreneur', 'startup', 'leadership', 'management',
        'consulting', 'marketing', 'sales', 'corporate', 'conference',
        'seminar', 'workshop', 'skill', 'development', 'resume', 'job'
    ],
    'Cultural & International': [
        'international', 'cultural', 'diversity', 'multicultural', 'ethnic',
        'asian', 'african', 'hispanic', 'latino', 'european', 'middle',
        'eastern', 'language', 'foreign', 'exchange', 'study', 'abroad',
        'global', 'world', 'country', 'nation', 'immigrant', 'refugee'
    ],
    'Social & Entertainment': [
        'social', 'fun', 'entertainment', 'party', 'event', 'festival',
        'celebration', 'friend', 'meeting', 'gathering', 'game', 'gaming',
        'board', 'video', 'trivia', 'karaoke', 'comedy', 'improv', 'anime',
        'comic', 'book', 'movie', 'tv', 'series', 'fandom', 'hobby'
    ]
}

def download_nltk_data():
    """Download required NLTK data if not already present."""
    try:
        try:
            _create_unverified_https_context = ssl._create_unverified_context
        except AttributeError:
            pass
        else:
            ssl._create_default_https_context = _create_unverified_https_context
        
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('wordnet', quiet=True)
        nltk.download('omw-1.4', quiet=True)
        logger.info("NLTK data downloaded successfully")
    except Exception as e:
        logger.warning(f"Could not download NLTK data: {e}")

''' def fetch_webpage(url, max_retries=3):
    """
    Fetch webpage content with error handling and retries.
    
    Args:
        url (str): URL to fetch
        max_retries (int): Maximum number of retry attempts
    
    Returns:
        requests.Response: Response object if successful, None otherwise
    """
    for attempt in range(max_retries):
        try:
            logger.info(f"Fetching URL: {url} (Attempt {attempt + 1}/{max_retries})")
            response = requests.get(url, headers=HEADERS, timeout=10)
            response.raise_for_status()
            logger.info(f"Successfully fetched {len(response.content)} bytes")
            return response
        except requests.exceptions.RequestException as e:
            logger.warning(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                logger.error(f"Failed to fetch {url} after {max_retries} attempts")
                return None'''

def fetch_webpage(url, max_retries=3):
    """
    Enhanced webpage fetching with Cloudflare bypass techniques.
    """
    import time
    import random
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    }
    
    session = requests.Session()
    session.headers.update(headers)
    
    for attempt in range(max_retries):
        try:
            time.sleep(random.uniform(2, 5))
            
            logger.info(f"Fetching URL: {url} (Attempt {attempt + 1}/{max_retries})")
            
            response = session.get(url, timeout=15, allow_redirects=True)
            
            if "challenge" in response.text.lower() or response.status_code == 503:
                logger.info("Cloudflare challenge detected, waiting...")
                time.sleep(random.uniform(5, 10))
                response = session.get(url, timeout=15, allow_redirects=True)
            
            response.raise_for_status()
            logger.info(f"Successfully fetched {len(response.content)} bytes")
            return response
            
        except requests.exceptions.RequestException as e:
            logger.warning(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(1, 3)
                time.sleep(wait_time)
            else:
                logger.error(f"Failed to fetch {url} after {max_retries} attempts")
                return None

def extract_club_data(soup, base_url):
    """
    Extract club information from BeautifulSoup object using multiple strategies.
    
    Args:
        soup (BeautifulSoup): Parsed HTML content
        base_url (str): Base URL for resolving relative links
    
    Returns:
        list: List of dictionaries containing club data
    """
    clubs = []
    
    club_selectors = [
        '.club', '.organization', '.student-org', '.group',
        '.club-item', '.org-item', '.club-card', '.org-card',
        '.club-listing', '.organization-listing',
        'div[class*="club"]', 'div[class*="organization"]', 
        'div[class*="group"]', 'div[class*="society"]',
        'li[class*="club"]', 'li[class*="organization"]',
        'article', 'section[class*="club"]',
        'tr', 'tbody tr'
    ]
    
    for selector in club_selectors:
        try:
            elements = soup.select(selector)
            if elements and len(elements) > 1: 
                logger.info(f"Found {len(elements)} potential clubs using selector: {selector}")
                
                for element in elements:
                    club_data = extract_single_club(element, base_url)
                    if club_data and club_data['name']:
                        clubs.append(club_data)
                
                if clubs:
                    break
        except Exception as e:
            logger.debug(f"Error with selector {selector}: {e}")
            continue
    
    if not clubs:
        logger.info("No clubs found with standard selectors, trying fallback method")
        clubs = extract_clubs_fallback(soup)
    
    seen_names = set()
    unique_clubs = []
    for club in clubs:
        if club['name'].lower() not in seen_names:
            seen_names.add(club['name'].lower())
            unique_clubs.append(club)
    
    logger.info(f"Extracted {len(unique_clubs)} unique clubs")
    return unique_clubs

def extract_single_club(element, base_url):
    """
    Extract club information from a single HTML element.
    
    Args:
        element: BeautifulSoup element containing club info
        base_url (str): Base URL for resolving relative links
    
    Returns:
        dict: Club data dictionary
    """
    club = {'name': '', 'description': '', 'tags': [], 'category': ''}
    
    name_selectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        '.title', '.name', '.club-name', '.org-name',
        'strong', 'b', '.heading', '.header'
    ]
    
    for selector in name_selectors:
        name_element = element.select_one(selector)
        if name_element:
            club['name'] = clean_text(name_element.get_text())
            if club['name']:
                break
    
    if not club['name']:
        text = element.get_text(strip=True)
        if text:
            lines = text.split('\n')
            club['name'] = clean_text(lines[0][:100])
    
    description_selectors = [
        '.description', '.desc', '.summary', '.about',
        '.club-description', '.org-description', 'p'
    ]
    
    description_texts = []
    for selector in description_selectors:
        desc_elements = element.select(selector)
        for desc_element in desc_elements:
            desc_text = clean_text(desc_element.get_text())
            if desc_text and len(desc_text) > 20: 
                description_texts.append(desc_text)
    
    if not description_texts:
        full_text = clean_text(element.get_text())
        if full_text and club['name']:
            desc = full_text.replace(club['name'], '').strip()
            if len(desc) > 20:
                description_texts.append(desc)
    
    club['description'] = ' '.join(description_texts[:3])  
    
    return club

def extract_clubs_fallback(soup):
    """
    Fallback method to extract clubs when standard selectors fail.
    
    Args:
        soup (BeautifulSoup): Parsed HTML content
    
    Returns:
        list: List of club dictionaries
    """
    clubs = []
    
    text_content = soup.get_text()
    lines = text_content.split('\n')
    
    potential_clubs = []
    current_club = None
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 3:
            continue
            
        
        is_potential_name = (
            len(line) < 80 and
            (any(word in line.lower() for word in ['club', 'society', 'organization', 'association', 'group']) or
             line.isupper() or
             line.istitle() or
             re.match(r'^[A-Z][a-z].*[A-Z]', line))
        )
        
        if is_potential_name:
            if current_club:
                potential_clubs.append(current_club)
            current_club = {'name': line, 'description': '', 'tags': [], 'category': ''}
        elif current_club and len(line) > 20:
            if current_club['description']:
                current_club['description'] += ' '
            current_club['description'] += line
    
    if current_club:
        potential_clubs.append(current_club)
    
    for club in potential_clubs:
        if club['name'] and len(club['name']) > 3:
            club['name'] = clean_text(club['name'])
            club['description'] = clean_text(club['description'][:500])  
            clubs.append(club)
    
    return clubs[:50] 

def clean_text(text):
    """
    Clean and normalize text content.
    
    Args:
        text (str): Raw text to clean
    
    Returns:
        str: Cleaned text
    """
    if not text:
        return ''
    
    text = ' '.join(text.split())
    
    text = re.sub(r'\s*\|\s*', ' | ', text)  
    text = re.sub(r'^\W+|\W+$', '', text)  
    
    return text.strip()

def extract_tags_from_text(text, num_tags=5):
    """
    Extract relevant tags from text using simple NLP.
    
    Args:
        text (str): Text to extract tags from
        num_tags (int): Maximum number of tags to extract
    
    Returns:
        list: List of relevant tags
    """
    if not text:
        return []
    
    try:
        tokens = word_tokenize(text.lower())
        
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [
            token for token in tokens 
            if token.isalpha() and token not in stop_words and len(token) > 2
        ]
        
        lemmatizer = WordNetLemmatizer()
        lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]
        
        # Count frequency
        from collections import Counter
        word_freq = Counter(lemmatized_tokens)
        
        # Get most common words as tags
        common_words = word_freq.most_common(num_tags * 2)  # Get more to filter
        
        # Filter out very common but not meaningful words
        generic_words = {
            'club', 'student', 'organization', 'group', 'society', 'member',
            'meeting', 'time', 'year', 'university', 'college', 'school'
        }
        
        tags = [
            word for word, count in common_words 
            if word not in generic_words and count > 1
        ]
        
        return tags[:num_tags]
        
    except Exception as e:
        logger.warning(f"Error extracting tags: {e}")
        # Fallback to simple keyword extraction
        words = re.findall(r'\b[a-z]{3,}\b', text.lower())
        return list(set(words))[:num_tags]

def determine_category(name, description, tags):
    """
    Determine club category based on name, description, and tags.
    
    Args:
        name (str): Club name
        description (str): Club description
        tags (list): List of tags
    
    Returns:
        str: Category name
    """
    combined_text = f"{name} {description} {' '.join(tags)}".lower()
    
    category_scores = {}
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in combined_text:
                if keyword in name.lower():
                    score += 3
                elif any(keyword in tag for tag in tags):
                    score += 2
                else:
                    score += 1
        
        category_scores[category] = score
    
    if category_scores:
        best_category = max(category_scores, key=category_scores.get)
        if category_scores[best_category] > 0:
            return best_category
    
    return 'Other'

def process_clubs(clubs):
    """
    Process clubs to add tags and categories.
    
    Args:
        clubs (list): List of club dictionaries
    
    Returns:
        list: Processed clubs with tags and categories
    """
    processed_clubs = []
    
    for club in clubs:
        try:
            tags = extract_tags_from_text(club['description'])
            
            name_lower = club['name'].lower()
            manual_tags = []
            
            if 'honor' in name_lower or 'honors' in name_lower:
                manual_tags.append('honors')
            if 'pre-med' in name_lower or 'pre-law' in name_lower:
                manual_tags.extend(['pre-professional', 'career'])
            if any(word in name_lower for word in ['international', 'global', 'world']):
                manual_tags.append('international')
            
            all_tags = list(set(tags + manual_tags))[:8]  
            
            category = determine_category(club['name'], club['description'], all_tags)
            
            processed_club = {
                'name': club['name'],
                'description': club['description'] or f"A student organization at the college focused on {club['name'].lower()}.",
                'tags': all_tags,
                'category': category
            }
            
            processed_clubs.append(processed_club)
            
        except Exception as e:
            logger.error(f"Error processing club '{club.get('name', 'Unknown')}': {e}")
            continue
    
    return processed_clubs

def main():
    """
    Main function to orchestrate the scraping and processing.
    """
    logger.info("Starting college club scraper")
    
    download_nltk_data()
    
    response = fetch_webpage(COLLEGE_CLUBS_URL)
    if not response:
        logger.error("Could not fetch webpage. Please check the URL and try again.")
        print("[]")  
        return
    
    try:
        soup = BeautifulSoup(response.content, 'html.parser')
        logger.info("HTML parsed successfully")
    except Exception as e:
        logger.error(f"Error parsing HTML: {e}")
        print("[]")
        return
    
    try:
        clubs = extract_club_data(soup, COLLEGE_CLUBS_URL)
        if not clubs:
            logger.warning("No clubs found. The page structure might be unusual.")
            clubs = [
                {
                    'name': 'Sample Academic Club',
                    'description': 'A club focused on academic excellence and scholarly activities.',
                    'tags': [],
                    'category': ''
                }
            ]
    except Exception as e:
        logger.error(f"Error extracting club data: {e}")
        print("[]")
        return
    
    try:
        processed_clubs = process_clubs(clubs)
        logger.info(f"Successfully processed {len(processed_clubs)} clubs")
    except Exception as e:
        logger.error(f"Error processing clubs: {e}")
        print("[]")
        return
    
    try:
        json_output = json.dumps(processed_clubs, indent=2, ensure_ascii=False)
        print(json_output)
        logger.info("JSON output generated successfully")
    except Exception as e:
        logger.error(f"Error generating JSON output: {e}")
        print("[]")

if __name__ == "__main__":
    main()