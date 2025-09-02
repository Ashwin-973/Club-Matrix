#!/usr/bin/env python3
"""
Instagram Scraper using Apify API
==================================

This script uses the Apify Instagram Scraper to collect public Instagram data
for a list of usernames. It extracts follower counts, post counts, and engagement
metrics (likes and comments) for recent posts.

Requirements:
- Python 3.6+
- requests library: pip install requests
- Apify API token (free tier available at https://apify.com/)

Usage:
1. Sign up for a free Apify account and get your API token
2. Set your API token in the APIFY_TOKEN variable below
3. Update the USERNAMES list with the Instagram usernames you want to scrape
4. Run the script: python instagram_scraper.py
"""

import requests
import json
import time
import sys
from typing import List, Dict, Optional, Any

# =============================================================================
# CONFIGURATION
# =============================================================================

# Replace with your Apify API token (get it from https://console.apify.com/account/integrations)
APIFY_TOKEN = "apify_api_WNCp1HOwe2LavtzUlQpGRhOcOsQmd40VZlxX"

# List of Instagram usernames to scrape (without @ symbol)
USERNAMES = [
    "snuc_cc",
]

# Number of recent posts to analyze for engagement metrics
POSTS_TO_ANALYZE = 10

# Apify Actor ID for Instagram Scraper
ACTOR_ID = "shu8hvrXbJbY3Eb9W"

# API endpoint configuration
APIFY_API_BASE = "https://api.apify.com/v2"

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def log_message(message: str, level: str = "INFO") -> None:
    """
    Log messages to stderr to avoid interfering with JSON output
    
    Args:
        message: Message to log
        level: Log level (INFO, ERROR, WARNING)
    """
    print(f"[{level}] {message}", file=sys.stderr)

def safe_get_value(data: Dict, key_path: List[str], default: Any = None) -> Any:
    """
    Safely extract nested dictionary values
    
    Args:
        data: Dictionary to extract from
        key_path: List of keys representing the path to the value
        default: Default value if key path doesn't exist
        
    Returns:
        Extracted value or default
    """
    try:
        result = data
        for key in key_path:
            result = result[key]
        return result
    except (KeyError, TypeError):
        return default

# =============================================================================
# APIFY API INTEGRATION
# =============================================================================

def start_scraping_task(username: str) -> Optional[str]:
    """
    Start an Instagram scraping task using Apify API
    
    Args:
        username: Instagram username to scrape
        
    Returns:
        Task ID if successful, None if failed
    """
    url = f"{APIFY_API_BASE}/acts/{ACTOR_ID}/runs"
    
    # Configuration for the Instagram scraper
    input_data = {
        "usernames": [username],
        "resultsType": "posts",
        "resultsLimit": POSTS_TO_ANALYZE + 50,  # Get extra posts to ensure we have enough
        "searchType": "user",
        "addParentData": True
    }
    
    headers = {
        "Authorization": f"Bearer {APIFY_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=input_data, headers=headers, timeout=30)
        response.raise_for_status()
        
        task_data = response.json()
        task_id = task_data.get("data", {}).get("id")
        
        if task_id:
            log_message(f"Started scraping task for @{username} (Task ID: {task_id})")
            return task_id
        else:
            log_message(f"Failed to start task for @{username}: No task ID returned", "ERROR")
            return None
            
    except requests.exceptions.RequestException as e:
        log_message(f"API request failed for @{username}: {str(e)}", "ERROR")
        return None
    except json.JSONDecodeError as e:
        log_message(f"Failed to parse API response for @{username}: {str(e)}", "ERROR")
        return None

def wait_for_task_completion(task_id: str, timeout: int = 300) -> Optional[Dict]:
    """
    Wait for Apify task to complete and return results
    
    Args:
        task_id: Task ID to monitor
        timeout: Maximum wait time in seconds
        
    Returns:
        Task results if successful, None if failed or timed out
    """
    url = f"{APIFY_API_BASE}/acts/{ACTOR_ID}/runs/{task_id}"
    headers = {"Authorization": f"Bearer {APIFY_TOKEN}"}
    
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            task_info = response.json()
            status = safe_get_value(task_info, ["data", "status"])
            
            if status == "SUCCEEDED":
                # Get the dataset with results
                dataset_id = safe_get_value(task_info, ["data", "defaultDatasetId"])
                if dataset_id:
                    return get_dataset_results(dataset_id)
                else:
                    log_message(f"Task {task_id} succeeded but no dataset ID found", "ERROR")
                    return None
                    
            elif status in ["FAILED", "ABORTED", "TIMED-OUT"]:
                log_message(f"Task {task_id} failed with status: {status}", "ERROR")
                return None
                
            # Task still running, wait before checking again
            time.sleep(10)
            
        except requests.exceptions.RequestException as e:
            log_message(f"Error checking task {task_id}: {str(e)}", "ERROR")
            time.sleep(5)
    
    log_message(f"Task {task_id} timed out after {timeout} seconds", "ERROR")
    return None

def get_dataset_results(dataset_id: str) -> Optional[List[Dict]]:
    """
    Retrieve results from Apify dataset
    
    Args:
        dataset_id: Dataset ID containing the results
        
    Returns:
        List of scraped data items or None if failed
    """
    url = f"{APIFY_API_BASE}/datasets/{dataset_id}/items"
    headers = {"Authorization": f"Bearer {APIFY_TOKEN}"}
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        return response.json()
        
    except requests.exceptions.RequestException as e:
        log_message(f"Failed to retrieve dataset {dataset_id}: {str(e)}", "ERROR")
        return None
    except json.JSONDecodeError as e:
        log_message(f"Failed to parse dataset results: {str(e)}", "ERROR")
        return None

# =============================================================================
# DATA PROCESSING
# =============================================================================

def process_user_data(username: str, raw_data: List[Dict]) -> Optional[Dict]:
    """
    Process raw Instagram data to extract relevant metrics
    
    Args:
        username: Instagram username
        raw_data: Raw data from Apify API
        
    Returns:
        Processed user data or None if processing failed
    """
    if not raw_data:
        log_message(f"No data received for @{username}", "ERROR")
        return None
    
    log_message(f"Debug: Received {len(raw_data)} items for @{username}")
    
    # Debug: Print the structure of the first item to understand the format
    if raw_data:
        first_item = raw_data[0]
        log_message(f"Debug: First item keys: {list(first_item.keys())}")
        log_message(f"Debug: First item type: {type(first_item)}")
    
    # Initialize variables
    follower_count = 0
    post_count = 0
    posts = []
    
    # Try different approaches to find profile data
    user_profile = None
    
    # Approach 1: Look for items with type "user"
    for item in raw_data:
        item_type = safe_get_value(item, ["type"])
        if item_type == "user":
            user_profile = item
            break
    
    # Approach 2: Look for items with profile information
    if not user_profile:
        for item in raw_data:
            if any(key in item for key in ["followersCount", "followers", "follower_count"]):
                user_profile = item
                break
    
    # Approach 3: Check if the first item contains profile data
    if not user_profile and raw_data:
        first_item = raw_data[0]
        if any(key in first_item for key in ["followersCount", "followers", "follower_count", "ownerFullName", "ownerUsername"]):
            user_profile = first_item
    
    # Extract profile metrics with multiple possible field names
    if user_profile:
        follower_count = (safe_get_value(user_profile, ["followersCount"]) or 
                         safe_get_value(user_profile, ["followers"]) or 
                         safe_get_value(user_profile, ["follower_count"]) or 0)
        
        post_count = (safe_get_value(user_profile, ["postsCount"]) or 
                     safe_get_value(user_profile, ["posts"]) or 
                     safe_get_value(user_profile, ["post_count"]) or 0)
        
        log_message(f"@{username}: {follower_count:,} followers, {post_count:,} posts")
    else:
        log_message(f"Warning: No clear profile data found for @{username}, using post data only", "WARNING")
    
    # Collect all posts
    for item in raw_data:
        # Check if this item is a post (has engagement metrics)
        if any(key in item for key in ["likesCount", "likes", "commentsCount", "comments"]):
            posts.append(item)
    
    # If no posts found, try treating all items as potential posts
    if not posts:
        posts = raw_data
    
    log_message(f"Debug: Found {len(posts)} potential posts for @{username}")
    
    # Process posts for engagement metrics
    likes_list = []
    comments_list = []
    
    # Sort posts by timestamp if available, otherwise use order received
    try:
        posts_sorted = sorted(posts, 
                             key=lambda x: safe_get_value(x, ["timestamp", "created_time", "taken_at_timestamp"], ""), 
                             reverse=True)
    except:
        posts_sorted = posts
    
    recent_posts = posts_sorted[:POSTS_TO_ANALYZE]
    
    for i, post in enumerate(recent_posts):
        # Try multiple field names for likes
        likes = (safe_get_value(post, ["likesCount"]) or 
                safe_get_value(post, ["likes"]) or 
                safe_get_value(post, ["like_count"]) or 0)
        
        # Try multiple field names for comments
        comments = (safe_get_value(post, ["commentsCount"]) or 
                   safe_get_value(post, ["comments"]) or 
                   safe_get_value(post, ["comment_count"]) or 0)
        
        if likes > 0 or comments > 0:  # Only include posts with some engagement
            likes_list.append(likes)
            comments_list.append(comments)
            log_message(f"Debug: Post {i+1}: {likes:,} likes, {comments:,} comments")
    
    # Calculate averages
    avg_likes = sum(likes_list) / len(likes_list) if likes_list else 0
    avg_comments = sum(comments_list) / len(comments_list) if comments_list else 0
    
    log_message(f"@{username}: Analyzed {len(likes_list)} posts with engagement - "
               f"Avg likes: {avg_likes:.1f}, Avg comments: {avg_comments:.1f}")
    
    # Return data even if we only have partial information
    return {
        "username": username,
        "follower_count": follower_count,
        "average_likes": round(avg_likes, 2),
        "average_comments": round(avg_comments, 2)
    }

# =============================================================================
# MAIN EXECUTION
# =============================================================================

def main():
    """
    Main function to orchestrate the Instagram scraping process
    """
    # Validate API token
    if APIFY_TOKEN == "your_apify_token_here":
        log_message("Please set your Apify API token in the APIFY_TOKEN variable", "ERROR")
        sys.exit(1)
    
    if not USERNAMES:
        log_message("Please add Instagram usernames to the USERNAMES list", "ERROR")
        sys.exit(1)
    
    log_message(f"Starting Instagram scraping for {len(USERNAMES)} usernames...")
    
    results = []
    
    for username in USERNAMES:
        log_message(f"Processing @{username}...")
        
        try:
            # Start scraping task
            task_id = start_scraping_task(username)
            if not task_id:
                log_message(f"Failed to start scraping for @{username}", "ERROR")
                continue
            
            # Wait for completion and get results
            raw_data = wait_for_task_completion(task_id)
            if not raw_data:
                log_message(f"Failed to get results for @{username}", "ERROR")
                continue
            
            # Process the data
            processed_data = process_user_data(username, raw_data)
            if processed_data:
                results.append(processed_data)
                log_message(f"Successfully processed @{username}")
            else:
                log_message(f"Failed to process data for @{username}", "ERROR")
                
        except Exception as e:
            log_message(f"Unexpected error processing @{username}: {str(e)}", "ERROR")
            continue
        
        # Add a small delay between requests to be respectful
        time.sleep(2)
    
    # Output final results as clean JSON
    if results:
        log_message(f"Successfully scraped {len(results)} out of {len(USERNAMES)} usernames")
        log_message("Outputting JSON results...")
        print(json.dumps(results, indent=2))
    else:
        log_message("No successful results to output", "ERROR")
        sys.exit(1)

if __name__ == "__main__":
    main()