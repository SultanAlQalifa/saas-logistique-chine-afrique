# SaaS Logistique Chine-Afrique

A comprehensive B2B SaaS platform for managing China-Africa freight logistics (maritime and aerial).

## Features

### 🚀 MVP Features Implemented

- **Multi-tenant Authentication**: Role-based access (Super Admin, Admin, Agent, Client)
- **Package Management**: Auto-generated IDs (CO-XXX), weight/dimensions, pricing calculations
- **Client Management**: Auto-generated client IDs (CL-XXX), contact information
- **Cargo Management**: Auto-generated cargo IDs (CG+YYMM+NNN), transport modes
- **Automatic Calculations**:
  - CBM calculation: (L×W×H)/1,000,000 for maritime
  - Pricing: Aerial (€/kg) vs Maritime (€/CBM)
  - ETA: Aerial +7d, Aerial Express +3d, Maritime +60d, Maritime Express +45d
- **Tracking System**: 6-digit PIN + public tracking page
- **Dashboard**: KPIs, recent packages, statistics
- **Status Workflow**: Planned → In Transit → Arrived → Collected

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase ready)
- **Authentication**: NextAuth.js with multi-role support
- **UI Components**: Custom components with Lucide icons

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET`: Random secret for JWT signing

### 3. Database Setup

```bash
# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Demo Credentials

After seeding the database:

- **Admin**: `admin@company.com` / `password123`
- **Agent**: `agent@company.com` / `password123`

## Tracking Demo

Test tracking with these PINs:
- `123456` - Maritime package in transit
- `789012` - Aerial express package planned
- `345678` - Maritime express package arrived

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── api/              # API routes
│   └── track/[pin]/      # Public tracking pages
├── components/
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utilities and configurations
├── types/                # TypeScript type definitions
└── utils/                # Helper functions and calculations
```

## Key Components

### Package Creation Form
- Real-time price calculation
- CBM calculation for maritime shipments
- Transport mode selection with ETA display
- Client selection and validation

### Dashboard
- Company-wide statistics
- Recent packages overview
- Quick access to create new packages
- Role-based navigation

### Public Tracking
- PIN-based package tracking
- Timeline view of package status
- Company and client information
- No authentication required

## Database Schema

### Core Entities
- **Company**: Multi-tenant isolation
- **User**: Role-based authentication
- **Client**: Auto-generated IDs (CL-XXX)
- **Cargo**: Auto-generated IDs (CG+YYMM+NNN)
- **Package**: Auto-generated IDs (CO-XXX)

### Auto-ID Generation
- Client IDs: `CL-001`, `CL-002`, etc.
- Package IDs: `CO-001`, `CO-002`, etc.
- Cargo IDs: `CG2501001` (CG + Year + Month + Number)

## Pricing Logic

### Aerial Transport
- Price = Weight (kg) × Price per kg (€)
- Default: €5.00/kg

### Maritime Transport
- Price = CBM × Price per CBM (€)
- CBM = (Length × Width × Height) / 1,000,000
- Default: €150.00/CBM

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

### Adding New Features

1. **API Routes**: Add to `src/app/api/`
2. **Pages**: Add to appropriate route groups
3. **Components**: Add to `src/components/`
4. **Types**: Update `src/types/index.ts`
5. **Database**: Update `prisma/schema.prisma`

## Deployment

### Supabase Setup
1. Create a new Supabase project
2. Get the database URL from Settings → Database
3. Update `DATABASE_URL` in your environment

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

## Next Steps

### Planned Features
- [ ] Cargo management interface
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] QR code generation
- [ ] Stripe payment integration
- [ ] Mobile Money integration (Orange Money, Wave)
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Mobile app (React Native)

### Integration Opportunities
- Stripe for payments
- Mobile Money APIs (Orange Money, Wave)
- Email services (SendGrid, Resend)
- SMS notifications
- WhatsApp Business API
- Shipping carrier APIs

## Support

For issues and questions:
1. Check the documentation
2. Review the demo data and examples
3. Test with provided demo credentials
4. Verify environment configuration

## License

Private project - All rights reserved.
