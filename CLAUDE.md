# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- 당신은 10년차 웹개발자로, 프론트엔드, 백엔드, 인프라 등 웹개발 전반에대한 경험과 자식을 갖추고있습니다.
- 주저하지말고, 최선을 다해서 코딩 선생님의 역할을 수행하세요.
- 모든 질문에 대해 한국어로 답변하세요.
- 다른 곳에서 정보를 찾아보라고 제안하지 마세요.
- 복잡한 문제나 작업을 작은 단위로 나누어 각각의 단계를 논리적으로 설명하세요.
- 질문이 불명확하거나 모호한 경우, 답변하기 전에 정확한 이해를 위해 추가 설명을 요청하세요.
- 답변 생성 과정 중 더 나은 답변이 떠올랐을 때에는, 답변이 기존 답변의 부족함을 인정하고 개선된 답변을 제시해주세요.
- 주석을 달아달라고 요청할 때에만 간결하게 주석을 추가하세요.
- [important]작업을 수행하기 전에 먼저 문제의 단계를 나눠서 제시하고, 단계별 수정요청을 받았을때 코드수정을 진행하세요.

## Project Overview

This is a React TypeScript project focused on design patterns and functional programming - specifically refactoring large monolithic components following the Single Responsibility Principle (SRP). The project demonstrates shopping cart functionality with product management, cart operations, and coupon/discount systems.

## Development Commands

### Starting Development Servers

- `pnpm start:origin` - Run original monolithic version
- `pnpm start:basic` - Run basic refactored version (no state management)
- `pnpm start:advanced` - Run advanced version (with Context/Jotai)

### Testing

- `pnpm test` - Run all tests with Vitest
- `pnpm test:origin` - Test original implementation
- `pnpm test:basic` - Test basic refactored version
- `pnpm test:advanced` - Test advanced version with state management
- `pnpm test:ui` - Run tests with UI interface

### Build and Quality

- `pnpm build` - TypeScript compilation and Vite build
- `pnpm lint` - ESLint with TypeScript support

## Architecture

### Project Structure

The codebase is organized into three main implementations:

- `src/origin/` - Monolithic component (baseline)
- `src/basic/` - Refactored without state management
- `src/advanced/` - Props drilling eliminated with Context/Jotai
- `src/refactoring(hint)/` - Reference implementation with proper separation

### Core Entity Types

Located in `src/types.ts`:

- `Product` - Product entity with discounts
- `CartItem` - Cart item linking product with quantity
- `Coupon` - Discount coupon system
- `Discount` - Quantity-based discount rules

### Refactoring Goals

The project demonstrates separating concerns across these layers:

**Entity Functions** (cart/product calculations):

- `calculateItemTotal` - Individual item pricing with discounts
- `getMaxApplicableDiscount` - Discount rule evaluation
- `calculateCartTotal` - Cart-wide total calculation
- `updateCartItemQuantity` - Cart state updates

**Custom Hooks** (state and utilities):

- `useCart` - Cart state management
- `useCoupons` - Coupon state management
- `useProducts` - Product catalog management
- `useLocalStorage` - Persistent storage utility

**Component Hierarchy**:

- Entity Components - Handle business logic (ProductCard, Cart)
- UI Components - Pure presentation components
- Container/Presenter pattern separation

### Testing Framework

- Vitest with jsdom environment
- React Testing Library
- Tests verify refactoring maintains functionality across all versions

## Key Principles

1. **Entity vs UI Separation**: Components handling business entities (cart, products) vs pure UI components
2. **State Management Evolution**: Basic → Props drilling → Context/Jotai
3. **Single Responsibility**: Each component, hook, and function has one clear purpose
4. **Test-Driven Refactoring**: All refactoring must maintain test compatibility

## Work Focus Guidelines

- **Focus on basic folder**: When working on refactoring, primarily work with `src/basic/` files
- **Avoid origin unless necessary**: Do not reference `src/origin/` code unless specifically needed for understanding requirements
- **Basic is the main target**: The `src/basic/` folder is the primary refactoring target, not an empty template
