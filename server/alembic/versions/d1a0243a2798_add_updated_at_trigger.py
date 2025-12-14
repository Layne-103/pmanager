"""Add updated_at trigger

Revision ID: d1a0243a2798
Revises: 84a2f28d4542
Create Date: 2025-12-13 22:29:59.526254

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd1a0243a2798'
down_revision: Union[str, Sequence[str], None] = '84a2f28d4542'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create the function for updating updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    """)

    # Create trigger on tickets table
    op.execute("""
        CREATE TRIGGER update_tickets_updated_at
        BEFORE UPDATE ON tickets
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    """)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop trigger
    op.execute("DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;")

    # Drop function
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column();")

