import { getFilteredPaginationData, getSortParams } from 'proton-mail/store/newsletterSubscriptions/helpers';
import type {
    SortSubscriptionsValue,
    SubscriptionPagination,
} from 'proton-mail/store/newsletterSubscriptions/interface';

import type {
    ApplyNewsletterSubscriptionsFilter,
    UpdateNewsletterSubscription,
} from '../interfaces/NewsletterSubscription';

interface GetNewslettersProps {
    sort?: SortSubscriptionsValue;
    pagination?: SubscriptionPagination;
}

export const getNewsletterSubscription = ({ pagination, sort }: GetNewslettersProps) => ({
    url: 'mail/v4/newsletter-subscriptions',
    method: 'GET',
    params: {
        ...getFilteredPaginationData(pagination),
        ...getSortParams(sort),
        // We hardcode this sort because it's used as fallback in case of coliding sorting
        'Sort[ID]': 'DESC',
        // We hardcode this params for the moment as we don't want to see spam subscription
        Spam: 0,
    },
});

export const applyNewsletterSubscriptionFilter = (
    subscriptionID: string,
    data: ApplyNewsletterSubscriptionsFilter
) => ({
    url: `mail/v4/newsletter-subscriptions/${subscriptionID}/filter`,
    method: 'POST',
    data,
});

export const unsubscribeNewsletterSubscription = (subscriptionID: string) => ({
    url: `mail/v4/newsletter-subscriptions/${subscriptionID}/unsubscribe`,
    method: 'POST',
});

export const updateNewsletterSubscription = (subscriptionID: string, data: UpdateNewsletterSubscription) => ({
    url: `mail/v4/newsletter-subscriptions/${subscriptionID}`,
    method: 'POST',
    data,
});
