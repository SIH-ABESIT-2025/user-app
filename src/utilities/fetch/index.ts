import { NotificationContent, NotificationTypes } from "@/types/NotificationProps";

// Utility function to get the correct base URL for API calls
const getApiUrl = (path: string) => {
    // In browser, use relative paths
    if (typeof window !== 'undefined') {
        return path;
    }
    
    // On server, use absolute URL if available
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL;
    return baseUrl ? `${baseUrl}${path}` : path;
};

export const getAllTweets = async (page = "1") => {
    const response = await fetch(`/api/tweets/all?page=${page}`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getRelatedTweets = async () => {
    const response = await fetch(`/api/tweets/related`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getUserTweets = async (username: string) => {
    const response = await fetch(`/api/tweets/${username}`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getUserLikes = async (username: string) => {
    const response = await fetch(`/api/tweets/${username}/likes`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getUserMedia = async (username: string) => {
    const response = await fetch(`/api/tweets/${username}/media`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getUserReplies = async (username: string) => {
    const response = await fetch(`/api/tweets/${username}/replies`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getUserTweet = async (tweetId: string, tweetAuthor: string) => {
    const response = await fetch(`/api/tweets/${tweetAuthor}/${tweetId}`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const createTweet = async (tweet: string) => {
    const response = await fetch(`/api/tweets/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tweet,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const logIn = async (candidate: string) => {
    // Only use fetch on client-side, server-side should not call this
    if (typeof window === 'undefined') {
        console.error('logIn should not be called from server-side');
        return { success: false, error: 'Server-side call not allowed' };
    }
    
    const url = getApiUrl('/api/auth/login');
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: candidate,
    });
    return response.json();
};

export const logInAsTest = async () => {
    const testAccount = {
        username: "test",
        password: "123456789",
    };
    return await logIn(JSON.stringify(testAccount));
};

export const logout = async () => {
    await fetch(`/api/auth/logout`, {
        cache: 'no-store',
    });
};

export const createUser = async (newUser: string) => {
    // Only use fetch on client-side, server-side should not call this
    if (typeof window === 'undefined') {
        console.error('createUser should not be called from server-side');
        return { success: false, error: 'Server-side call not allowed' };
    }
    
    const url = getApiUrl('/api/users/create');
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: newUser,
    });
    return response.json();
};

export const getUser = async (username: string) => {
    const response = await fetch(`/api/users/${username}`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const editUser = async (updatedUser: string, username: string) => {
    const response = await fetch(`/api/users/${username}/edit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: updatedUser,
    });
    return response.json();
};

export const updateTweetLikes = async (tweetId: string, tweetAuthor: string, tokenOwnerId: string, isLiked: boolean) => {
    const route = isLiked ? "unlike" : "like";
    const response = await fetch(`/api/tweets/${tweetAuthor}/${tweetId}/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tokenOwnerId,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const updateRetweets = async (tweetId: string, tweetAuthor: string, tokenOwnerId: string, isRetweeted: boolean) => {
    const route = isRetweeted ? "unretweet" : "retweet";
    const response = await fetch(`/api/tweets/${tweetAuthor}/${tweetId}/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tokenOwnerId,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const updateUserFollows = async (followedUsername: string, tokenOwnerId: string, isFollowed: boolean) => {
    const route = isFollowed ? "unfollow" : "follow";
    const response = await fetch(`/api/users/${followedUsername}/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tokenOwnerId,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const deleteTweet = async (tweetId: string, tweetAuthor: string, tokenOwnerId: string) => {
    const response = await fetch(`/api/tweets/${tweetAuthor}/${tweetId}/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tokenOwnerId,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const createReply = async (reply: string, tweetAuthor: string, tweetId: string) => {
    const response = await fetch(`/api/tweets/${tweetAuthor}/${tweetId}/reply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: reply,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getReplies = async (tweetAuthor: string, tweetId: string) => {
    const response = await fetch(`/api/tweets/${tweetAuthor}/${tweetId}/reply`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const search = async (text: string) => {
    const response = await fetch(`/api/search?q=${text}`);
    return response.json();
};

export const getRandomThreeUsers = async () => {
    const response = await fetch(`/api/users/random`);
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const createMessage = async (message: string) => {
    const response = await fetch(`/api/messages/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: message,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getUserMessages = async (username: string) => {
    const response = await fetch(`/api/messages/${username}`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const checkUserExists = async (username: string) => {
    // Only use fetch on client-side, server-side should not call this
    if (typeof window === 'undefined') {
        console.error('checkUserExists should not be called from server-side');
        return { success: false, error: 'Server-side call not allowed' };
    }
    
    const url = getApiUrl(`/api/users/exists?q=${username}`);
    const response = await fetch(url);
    return response.json();
};

export const deleteConversation = async (participants: string[], tokenOwnerId: string) => {
    const response = await fetch(`/api/messages/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ participants, tokenOwnerId }),
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getNotifications = async () => {
    const response = await fetch(`/api/notifications`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const createNotification = async (
    recipient: string,
    type: NotificationTypes,
    secret: string,
    notificationContent: NotificationContent = null
) => {
    // Use the getApiUrl utility for proper URL handling
    const url = getApiUrl('/api/notifications/create');
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient, type, secret, notificationContent }),
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const markNotificationsRead = async () => {
    const response = await fetch(`/api/notifications/read`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

// Complaint-related functions
export const getMinistries = async () => {
    const response = await fetch(`/api/ministries`, {
        cache: 'force-cache', // Cache for 1 hour
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "Failed to fetch ministries");
    return json.ministries || json.data || json;
};

export const getAllComplaints = async (page = "1", filters: any = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    const response = await fetch(`/api/complaints?${params}`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "Failed to fetch complaints");
    return json;
};

export const getComplaintsPage = async ({ pageParam = 1, filters = {} }: { pageParam?: number; filters?: any }) => {
    return getAllComplaints(pageParam.toString(), filters);
};

export const getComplaint = async (id: string) => {
    const response = await fetch(`/api/complaints/${id}`, {
        cache: 'no-store',
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "Failed to fetch complaint");
    return json;
};

export const createComplaint = async (complaint: string) => {
    const response = await fetch(`/api/complaints`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: complaint,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "Failed to create complaint");
    return json;
};

export const updateComplaint = async (id: string, update: string) => {
    const response = await fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: update,
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "Failed to update complaint");
    return json;
};

export const deleteComplaint = async (id: string) => {
    const response = await fetch(`/api/complaints/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "Failed to delete complaint");
    return json;
};