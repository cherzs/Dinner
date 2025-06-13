import random
from typing import List, Dict, Any
from collections import defaultdict
import json

def calculate_compatibility_score(user1: Dict, user2: Dict) -> float:
    """
    Calculate compatibility score between two users based on various factors
    """
    score = 0.0
    
    # Budget compatibility (CRITICAL - users must have same budget preference)
    if user1.get('budget_preference') == user2.get('budget_preference'):
        score += 10  # Very high score for budget match
    else:
        return 0  # No compatibility if budget doesn't match
    
    # Age compatibility (prefer similar age ranges)
    age_diff = abs(user1['age'] - user2['age'])
    if age_diff <= 5:
        score += 3
    elif age_diff <= 10:
        score += 1
    
    # Interest compatibility
    interests1 = set([i.strip().lower() for i in user1.get('interests', '').split(',') if i.strip()])
    interests2 = set([i.strip().lower() for i in user2.get('interests', '').split(',') if i.strip()])
    
    common_interests = len(interests1.intersection(interests2))
    score += common_interests * 2
    
    # Language compatibility
    if user1.get('preferred_language') == user2.get('preferred_language'):
        score += 2
    
    # Dietary restrictions compatibility 
    diet1 = user1.get('dietary_restrictions', 'Tidak Ada')
    diet2 = user2.get('dietary_restrictions', 'Tidak Ada')
    if diet1 == diet2 or diet1 == 'Tidak Ada' or diet2 == 'Tidak Ada':
        score += 1  # Compatible dietary needs
    
    # Occupation diversity (different is better for conversation)
    if user1.get('occupation', '').lower() != user2.get('occupation', '').lower():
        score += 1
    
    return score

def balance_group_demographics(group: List[Dict]) -> float:
    """
    Calculate a score for how well balanced the group is demographically
    """
    if len(group) < 2:
        return 0
    
    score = 0.0
    
    # Gender balance (if available)
    # This would need to be added to the user model
    
    # Age distribution
    ages = [user['age'] for user in group]
    age_range = max(ages) - min(ages)
    if age_range > 5 and age_range < 20:  # Good age diversity
        score += 2
    
    # Occupation diversity
    occupations = [user.get('occupation', '').lower() for user in group if user.get('occupation')]
    unique_occupations = len(set(occupations))
    if unique_occupations > len(occupations) * 0.7:  # 70% or more different occupations
        score += 3
    
    return score

def create_optimal_groups(users: List[Dict], group_size: int = 6) -> List[List[Dict]]:
    """
    Create optimal groups using a greedy algorithm with backtracking
    """
    if len(users) < 3:
        return []
    
    # Sort users by some criteria (e.g., registration time for fairness)
    users_sorted = sorted(users, key=lambda x: x.get('registration_date', ''))
    
    groups = []
    remaining_users = users_sorted.copy()
    
    while len(remaining_users) >= 3:  # Minimum group size
        current_group_size = min(group_size, len(remaining_users))
        
        # If we have exactly the group size or close to it, form a group
        if len(remaining_users) <= group_size + 2:  # Avoid very small remaining groups
            current_group_size = len(remaining_users)
        
        best_group = create_single_group(remaining_users, current_group_size)
        
        if best_group:
            groups.append(best_group)
            # Remove selected users from remaining pool
            for user in best_group:
                remaining_users.remove(user)
        else:
            # If we can't form a good group, just take the first users
            fallback_group = remaining_users[:current_group_size]
            groups.append(fallback_group)
            remaining_users = remaining_users[current_group_size:]
    
    # Handle remaining users by adding them to existing groups if possible
    if remaining_users and groups:
        for user in remaining_users:
            # Find the group with the best compatibility
            best_group_idx = 0
            best_score = -1
            
            for i, group in enumerate(groups):
                if len(group) < group_size:  # Only add to non-full groups
                    avg_compatibility = sum(calculate_compatibility_score(user, member) for member in group) / len(group)
                    if avg_compatibility > best_score:
                        best_score = avg_compatibility
                        best_group_idx = i
            
            if len(groups[best_group_idx]) < group_size:
                groups[best_group_idx].append(user)
    
    return groups

def create_single_group(available_users: List[Dict], target_size: int) -> List[Dict]:
    """
    Create a single optimal group from available users
    """
    if len(available_users) < target_size:
        return available_users
    
    # Start with a random seed user
    seed_user = available_users[0]
    group = [seed_user]
    remaining = [u for u in available_users if u != seed_user]
    
    # Greedily add users that maximize group compatibility
    while len(group) < target_size and remaining:
        best_user = None
        best_score = -1
        
        for candidate in remaining:
            # Calculate average compatibility with existing group members
            compatibility_scores = [calculate_compatibility_score(candidate, member) for member in group]
            avg_compatibility = sum(compatibility_scores) / len(compatibility_scores)
            
            # Also consider group balance
            temp_group = group + [candidate]
            balance_score = balance_group_demographics(temp_group)
            
            total_score = avg_compatibility + balance_score * 0.3  # Weight balance less than compatibility
            
            if total_score > best_score:
                best_score = total_score
                best_user = candidate
        
        if best_user:
            group.append(best_user)
            remaining.remove(best_user)
        else:
            # If no good candidate found, just add the first remaining user
            group.append(remaining[0])
            remaining.remove(remaining[0])
    
    return group

def assign_restaurants(groups: List[List[Dict]], city: str) -> List[Dict]:
    """
    Assign restaurants to groups (placeholder implementation)
    In production, this would integrate with a restaurant database/API
    """
    restaurants = {
        'Jakarta': [
            {'name': 'The Social House', 'address': 'Pacific Place Mall, Jakarta'},
            {'name': 'Skye Bar & Restaurant', 'address': 'BCA Tower, Jakarta'},
            {'name': 'Atmosphere', 'address': 'Plaza Indonesia, Jakarta'},
            {'name': 'Bleu Alley Brasserie', 'address': 'Kemang, Jakarta'},
            {'name': 'Cork & Screw', 'address': 'Kemang, Jakarta'},
        ],
        'Bandung': [
            {'name': 'The Peak Resort Dining', 'address': 'Dago, Bandung'},
            {'name': 'Skylounge', 'address': 'Pasteur, Bandung'},
            {'name': 'The Restaurant', 'address': 'Riau Street, Bandung'},
            {'name': 'Kampung Daun', 'address': 'Surya Sumantri, Bandung'},
        ],
        'Surabaya': [
            {'name': 'Layar Seafood', 'address': 'Kenjeran, Surabaya'},
            {'name': 'Kemang Restaurant', 'address': 'Gubeng, Surabaya'},
            {'name': 'Tiga Rasa', 'address': 'Darmo, Surabaya'},
        ]
    }
    
    city_restaurants = restaurants.get(city, [
        {'name': 'Local Restaurant', 'address': f'{city} City Center'}
    ])
    
    group_assignments = []
    for i, group in enumerate(groups):
        restaurant = city_restaurants[i % len(city_restaurants)]
        group_assignments.append({
            'group': group,
            'restaurant': restaurant
        })
    
    return group_assignments

def run_matching_algorithm(registrations: List[Dict], event_data: Dict) -> List[Dict]:
    """
    Main function to run the complete matching algorithm
    """
    # Extract user data from registrations
    users = [reg['user'] for reg in registrations]
    
    # Create optimal groups
    groups = create_optimal_groups(users, event_data.get('max_participants', 6))
    
    # Assign restaurants
    group_assignments = assign_restaurants(groups, event_data['city'])
    
    # Return formatted results
    results = []
    for i, assignment in enumerate(group_assignments):
        results.append({
            'group_id': i + 1,
            'members': assignment['group'],
            'restaurant_name': assignment['restaurant']['name'],
            'restaurant_address': assignment['restaurant']['address'],
            'meeting_time': event_data['event_date']  # This could be adjusted per group
        })
    
    return results 