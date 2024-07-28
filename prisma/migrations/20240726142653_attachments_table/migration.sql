-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "product_id" TEXT,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachments_id_key" ON "attachments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "attachments_file_name_key" ON "attachments"("file_name");

-- CreateIndex
CREATE UNIQUE INDEX "attachments_product_id_key" ON "attachments"("product_id");
