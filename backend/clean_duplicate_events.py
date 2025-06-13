#!/usr/bin/env python3

from app import app, db, Event
from collections import defaultdict

def clean_duplicate_events():
    """Remove duplicate events from database"""
    with app.app_context():
        try:
            # Get all events
            all_events = Event.query.all()
            print(f"Found {len(all_events)} total events")
            
            # Group events by title and city
            event_groups = defaultdict(list)
            for event in all_events:
                key = (event.title, event.city)
                event_groups[key].append(event)
            
            # Find and remove duplicates
            duplicates_removed = 0
            for key, events in event_groups.items():
                if len(events) > 1:
                    print(f"Found {len(events)} duplicates for: {key[0]} in {key[1]}")
                    # Keep the first one, remove the rest
                    for event in events[1:]:
                        print(f"  Removing event ID {event.id}")
                        db.session.delete(event)
                        duplicates_removed += 1
            
            if duplicates_removed > 0:
                db.session.commit()
                print(f"✅ Removed {duplicates_removed} duplicate events")
            else:
                print("✅ No duplicate events found")
                
            # Show remaining events
            remaining_events = Event.query.all()
            print(f"\nRemaining events ({len(remaining_events)}):")
            for event in remaining_events:
                print(f"  - {event.title} ({event.city}) - ID: {event.id}")
                
        except Exception as e:
            print(f"❌ Error cleaning duplicate events: {e}")

if __name__ == '__main__':
    clean_duplicate_events() 