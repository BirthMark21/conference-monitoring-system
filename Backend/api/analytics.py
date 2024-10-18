from collections import Counter
from .models import Review
from django.db import models
def generate_review_statistics():
    reviews = Review.objects.all()
    total_reviews = reviews.count()
    total_rating = sum(review.rating for review in reviews)
    
    if total_reviews > 0:
        average_rating = total_rating / total_reviews
    else:
        average_rating = 0

    # Calculate distribution of ratings
    rating_distribution = Counter(review.rating for review in reviews)

    # Find top reviewers
    top_reviewers = Review.objects.values('reviewer__name').annotate(total_reviews=models.Count('reviewer')).order_by('-total_reviews')[:5]

    return {
        'total_reviews': total_reviews,
        'average_rating': average_rating,
        'rating_distribution': rating_distribution,
        'top_reviewers': top_reviewers
    }
