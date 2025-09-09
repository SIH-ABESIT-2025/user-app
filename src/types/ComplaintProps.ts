export interface MinistryProps {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ComplaintAttachmentProps {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: 'image' | 'video' | 'audio' | 'document';
    fileSize: number;
    mimeType: string;
    createdAt: Date;
}

export interface ComplaintUpdateProps {
    id: string;
    status: ComplaintStatus;
    message: string;
    createdAt: Date;
    updatedBy: {
        id: string;
        name?: string;
        username: string;
    };
}

export interface ComplaintCommentProps {
    id: string;
    content: string;
    isInternal: boolean;
    createdAt: Date;
    author: {
        id: string;
        name?: string;
        username: string;
        photoUrl?: string;
    };
}

export interface ComplaintProps {
    id: string;
    title: string;
    description: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    priority: ComplaintPriority;
    status: ComplaintStatus;
    complaintNumber: string;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    
    user: {
        id: string;
        name?: string;
        username: string;
        photoUrl?: string;
    };
    
    ministry: MinistryProps;
    
    assignedTo?: {
        id: string;
        name?: string;
        username: string;
    };
    
    attachments: ComplaintAttachmentProps[];
    updates: ComplaintUpdateProps[];
    comments: ComplaintCommentProps[];
}

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ComplaintStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | 'CLOSED';

export interface CreateComplaintProps {
    title: string;
    description: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    priority: ComplaintPriority;
    ministryId: string;
    attachments?: File[];
}

export interface ComplaintFormData {
    title: string;
    description: string;
    location: string;
    priority: ComplaintPriority;
    ministryId: string;
    attachments: File[];
}
