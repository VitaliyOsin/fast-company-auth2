import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";

const CommentsContext = React.createContext();

export const useComments = () => {
    return useContext(CommentsContext);
};

export const CommentsProvider = ({ children }) => {
    const { userId } = useParams();
    const { currentUser } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    async function createComment(data) {
        const comment = {
            ...data,
            _id: nanoid(),
            pageId: userId,
            created_at: (Date.now()),
            userId: currentUser._id
        };
        try {
            const { content } = await commentService.createComment(comment);
            setComments(prevState => [...prevState, content]);
        } catch (err) {
            errorCatcher(err);
        }
    }

    async function getComments() {
        try {
            const { content } = await commentService.getComments(userId);
            setComments(content);
        } catch (error) {
            errorCatcher(error);
        } finally {
            setLoading(false);
        }
    }

    async function removeComment(id) {
        try {
            const { content } = await commentService.removeComment(id);
            if (content === null) {
                setComments(prevState => prevState.filter(c => c._id !== id));
            }
        } catch (error) {
            errorCatcher(error);
        }
    }

    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }

    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);

    useEffect(() => {
        getComments();
    }, [userId]);
    return (
        <CommentsContext.Provider value={{ comments, createComment, getComments, removeComment, isLoading }}>
            { children }
        </CommentsContext.Provider>
    );
};

CommentsProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
