-- CreateTable
CREATE TABLE "games" (
    "game_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "release_date" DATE NOT NULL,
    "developer" VARCHAR(255),
    "publisher" VARCHAR(255),
    "price" DECIMAL(10,2) NOT NULL,
    "platform" VARCHAR(255),
    "genre" VARCHAR(255),
    "image_url" VARCHAR NOT NULL,
    "bg_image" VARCHAR NOT NULL,
    "take_a_look" BOOLEAN NOT NULL,
    "popularity" INTEGER NOT NULL,
    "prod_id" VARCHAR NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "salary" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "percent_of_bargain" INTEGER NOT NULL,
    "discount_code" VARCHAR NOT NULL,

    CONSTRAINT "salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "game_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_game_id_idx" ON "games"("game_id");

-- AddForeignKey
ALTER TABLE "salary" ADD CONSTRAINT "salary_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library" ADD CONSTRAINT "library_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
