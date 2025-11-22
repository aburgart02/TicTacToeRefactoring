import { renderHook, act } from '@testing-library/react';
import { useTicTacToe } from './useTicTacToe';
import { describe, it, expect } from 'vitest';

describe('useTicTacToe', () => {
    it('should initialize with default state', () => {
        const { result } = renderHook(() => useTicTacToe());

        expect(result.current.board).toEqual(Array(9).fill(null));
        expect(result.current.isXNext).toBe(true);
        expect(result.current.winner).toBeNull();
        expect(result.current.winningLine).toBeNull();
    });

    it('should handle moves correctly', () => {
        const { result } = renderHook(() => useTicTacToe());

        act(() => {
            result.current.handleClick(0);
        });

        expect(result.current.board[0]).toBe('X');
        expect(result.current.isXNext).toBe(false);

        act(() => {
            result.current.handleClick(1);
        });

        expect(result.current.board[1]).toBe('O');
        expect(result.current.isXNext).toBe(true);
    });

    it('should allow player X to win horizontally', () => {
        const { result } = renderHook(() => useTicTacToe());

        act(() => {
            result.current.handleClick(0);
        });
        act(() => {
            result.current.handleClick(3);
        });
        act(() => {
            result.current.handleClick(1);
        });
        act(() => {
            result.current.handleClick(4);
        });
        act(() => {
            result.current.handleClick(2);
        });

        expect(result.current.winner).toBe('X');
        expect(result.current.winningLine).toEqual([0, 1, 2]);
    });

    it('should detect a draw', () => {
        const { result } = renderHook(() => useTicTacToe());
        const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];

        moves.forEach((index) => {
            act(() => {
                result.current.handleClick(index);
            });
        });

        expect(result.current.winner).toBe('Draw');
        expect(result.current.winningLine).toBeNull();
    });

    it('should not allow moves on occupied cells', () => {
        const { result } = renderHook(() => useTicTacToe());

        act(() => {
            result.current.handleClick(0);
        });

        act(() => {
            result.current.handleClick(0);
        });

        expect(result.current.board[0]).toBe('X');
        expect(result.current.isXNext).toBe(false);
    });

    it('should not allow moves after game over', () => {
        const { result } = renderHook(() => useTicTacToe());

        [0, 3, 1, 4, 2].forEach((index) => {
            act(() => {
                result.current.handleClick(index);
            });
        });

        expect(result.current.winner).toBe('X');

        act(() => {
            result.current.handleClick(8);
        });

        expect(result.current.board[8]).toBeNull();
    });

    it('should reset the game', () => {
        const { result } = renderHook(() => useTicTacToe());

        act(() => {
            result.current.handleClick(0);
            result.current.resetGame();
        });

        expect(result.current.board).toEqual(Array(9).fill(null));
        expect(result.current.isXNext).toBe(true);
        expect(result.current.winner).toBeNull();
    });

    it('should allow player O to win vertically', () => {
        const { result } = renderHook(() => useTicTacToe());
        const moves = [0, 1, 3, 4, 8, 7];

        moves.forEach((index) => act(() => result.current.handleClick(index)));

        expect(result.current.winner).toBe('O');
        expect(result.current.winningLine).toEqual([1, 4, 7]);
        expect(result.current.isXNext).toBe(false);
    });

    it('should detect a diagonal winning line', () => {
        const { result } = renderHook(() => useTicTacToe());
        const moves = [0, 1, 4, 2, 8];

        moves.forEach((index) => act(() => result.current.handleClick(index)));

        expect(result.current.winner).toBe('X');
        expect(result.current.winningLine).toEqual([0, 4, 8]);
    });
});
