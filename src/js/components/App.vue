<template>
	<div @contextmenu="$event.preventDefault()">
		<!-- <div> -->
		<header>
			<div class="flex justify-between">
				<div class="flex flex-wrap gap-2 p-3">
					<button
						class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3"
						type="button"
						v-tooltip="{ content: 'Load a new randomizer seed', delay: { show: 0 } }"
						@click="loadNewSeedModal = true">
						<font-awesome-icon :icon="['fas', 'file-circle-plus']" />
					</button>
					<button class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3" type="button" v-tooltip="{ content: 'Export progress', delay: { show: 0 } }" @click="save.exportSave">
						<font-awesome-icon :icon="['fas', 'floppy-disk']" />
					</button>
					<input ref="_importSaveFileInput" class="hidden" type="file" accept="application/json" @change="save.importSave" />
					<button
						class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3"
						type="button"
						v-tooltip="{ content: 'Import progress', delay: { show: 0 } }"
						@click="
							() => {
								if (_importSaveFileInput) _importSaveFileInput.click();
							}
						">
						<font-awesome-icon :icon="['fas', 'download']" />
					</button>
					<button class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3 mr-10" type="button" v-tooltip="{ content: 'Reset progress', delay: { show: 0 } }" @click="resetSavePrompt">
						<font-awesome-icon :icon="['fas', 'trash']" />
					</button>
					<button
						class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3"
						type="button"
						v-tooltip="{ content: 'Randomizer settings', delay: { show: 0 } }"
						@click="randomizerSettingsModalVisible = true">
						<font-awesome-icon :icon="['fas', 'dice']" />
					</button>
					<button
						class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3"
						type="button"
						v-tooltip="{ content: 'Logic settings', delay: { show: 0 } }"
						@click="logicSettingsModalVisible = true">
						<font-awesome-icon :icon="['fas', 'brain']" />
					</button>
					<button
						class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3"
						type="button"
						v-tooltip="{ content: 'Reset randomizer and logic', delay: { show: 0 } }"
						@click="resetConfigsPrompt">
						<font-awesome-icon :icon="['fas', 'trash']" />
					</button>

					<div class="flex justify-items-center items-center ml-4">
						<p v-if="save.data.randomizer_seed_hash_items">Hash items: {{ save.data.randomizer_seed_hash_items }}</p>
					</div>
				</div>
				<div class="flex justify-end">
					<div class="flex flex-wrap gap-2 p-3">
						<button
							class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3"
							type="button"
							v-tooltip="{ content: 'Disable items', delay: { show: 0 } }"
							@click="disableItemsModalVisible = true">
							<font-awesome-icon :icon="['fas', 'braille']" />
						</button>
						<button
							class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3"
							type="button"
							v-tooltip="{ content: 'Edit tracker settings', delay: { show: 0 } }"
							@click="trackerSettingsModalVisible = true">
							<font-awesome-icon :icon="['fas', 'wrench']" />
						</button>
						<button class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3" type="button" v-tooltip="{ content: 'Reset tracker configs', delay: { show: 0 } }" @click="resetTrackerPrompt">
							<font-awesome-icon :icon="['fas', 'trash']" />
						</button>
						<div class="bg-sky-950 hover:bg-sky-800 w-fit flex rounded-md p-3 items-center ml-10" type="button" v-tooltip="{ content: 'Edit tracker layout', delay: { show: 0 } }">
							<p class="mr-5">
								<font-awesome-icon :icon="['fas', 'table']" />
							</p>
							<input id="edit_tracker_layout" type="checkbox" v-model="layout.editingLayout" />
							<label for="edit_tracker_layout" />
						</div>
						<button class="bg-sky-950 hover:bg-sky-800 w-fit rounded-md p-3" type="button" v-tooltip="{ content: 'Restore default layout', delay: { show: 0 } }" @click="resetLayoutPrompt">
							<font-awesome-icon :icon="['fas', 'trash']" />
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Tracker content -->
		<div>
			<GridLayout v-model:layout="layout.tracker" :col-num="100" :row-height="1" vertical-compact use-css-transforms :is-resizable="layout.editingLayout">
				<template v-for="grid_item in layout.tracker" :key="grid_item.i">
					<GridItem
						class="relative bg-sky-950 p-3 rounded-md overflow-hidden"
						:class="{
							'bg-sky-950': !(save.data.configs.tracker.compact_items && grid_item.i == 'items_compact')
						}"
						:style="{
							backgroundColor: save.data.configs.tracker.compact_items && grid_item.i == 'items_compact' ? save.data.configs.tracker.compact_item_background_hex_color : '#082f49'
						}"
						:key="grid_item.i"
						:x="grid_item.x"
						:y="grid_item.y"
						:w="grid_item.w"
						:h="grid_item.h"
						:i="grid_item.i"
						drag-allow-from=".draggable-handle"
						drag-ignore-from=".no-drag"
						v-if="map.panelVisible(grid_item.i)">
						<div v-if="layout.editingLayout" class="draggable-handle absolute top-[15px] right-[15px]">
							<font-awesome-icon :icon="['fas', 'bars']" />
						</div>
						<div class="no-drag">
							<template v-if="grid_item.i == 'stars'">
								<h2>Stars</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.stars" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items[grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											imageFolder="stars"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'partners'">
								<h2>Partners</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.partners" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items[grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											imageFolder="partners"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'equipments'">
								<h2>Equipments</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.equipments" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items[grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name[save.data.items[trackerItemKey]]"
											:itemKey="trackerItemKey"
											imageFolder="equipments"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:levelItem="true"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'items_compact'">
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.stars" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['stars'][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											imageFolder="stars"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.partners" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['partners'][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											imageFolder="partners"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.equipments" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['equipments'][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name[save.data.items[trackerItemKey]]"
											:itemKey="trackerItemKey"
											imageFolder="equipments"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:levelItem="true"
											:initial="trackerItemConfigs.initial" />
									</template>
									<template v-for="(chaptersItems, chapter) in tracker.items.items" :key="chapter">
										<template v-for="(trackerItemConfigs, trackerItemKey) in chaptersItems" :key="trackerItemKey">
											<Item
												v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][chapter][trackerItemKey]"
												@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
												@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
												:itemName="trackerItemConfigs.name"
												:itemKey="trackerItemKey"
												:imageFolder="'items/' + chapter"
												:itemCount="save.data.items[trackerItemKey]"
												:itemCountMax="trackerItemConfigs.max"
												:initial="trackerItemConfigs.initial" />
										</template>
									</template>
									<template
										v-if="save.data.configs.logic.letters_randomized && save.data.configs.tracker.compact_item_show_letters"
										v-for="(chaptersItems, chapter) in tracker.items.letters"
										:key="chapter">
										<template v-for="(trackerItemConfigs, trackerItemKey) in chaptersItems" :key="trackerItemKey">
											<Item
												v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['letters'][chapter][trackerItemKey]"
												@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs, 'letters')"
												@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs, 'letters')"
												:itemName="trackerItemConfigs.name"
												:itemKey="trackerItemKey"
												imageFolder="letters"
												:itemCount="save.data.items.letters[trackerItemKey]"
												:itemCountMax="trackerItemConfigs.max"
												:initial="trackerItemConfigs.initial"
												:tooltipDelay="0" />
										</template>
									</template>
									<template
										v-if="save.data.configs.logic.koopa_koot && save.data.configs.tracker.compact_item_show_favors"
										v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.koopa_koot_favors"
										:key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['koopa_koot_favors'][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs, 'koopa_koot_favors')"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs, 'koopa_koot_favors')"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											imageFolder="koopa_koot_favors"
											:itemCount="save.data.items.koopa_koot_favors[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
									<template
										v-if="save.data.configs.logic.trading_event_randomized && save.data.configs.tracker.compact_item_show_trading_events"
										v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.trading_event_toad"
										:key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['trading_event_toad'][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs, 'trading_event_toad')"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs, 'trading_event_toad')"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											imageFolder="trading_event_toad"
											:itemCount="save.data.items.trading_event_toad[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.misc" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['misc'][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											imageFolder="misc"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'items_per_chapter'">
								<div class="flex flex-col">
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>P</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.prologue" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['prologue'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/prologue"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>C1</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter1" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['chapter1'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/chapter1"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>C2</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter2" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['chapter2'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/chapter2"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>C3</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter3" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['chapter3'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/chapter3"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>C4</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter4" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['chapter4'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/chapter4"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>C5</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter5" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['chapter5'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/chapter5"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>C6</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter6" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['chapter6'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/chapter6"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>C7</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter7" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['chapter7'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/chapter7"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p>C8</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter8" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['chapter8'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/chapter8"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
									<div class="flex flex-wrap items-center gap-x-5">
										<div class="flex-none w-5">
											<p v-tooltip="'Other'">O</p>
										</div>
										<div class="flex-1">
											<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
												<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.other" :key="trackerItemKey">
													<Item
														v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items']['other'][trackerItemKey]"
														@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
														@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
														:itemName="trackerItemConfigs.name"
														:itemKey="trackerItemKey"
														imageFolder="items/other"
														:itemCount="save.data.items[trackerItemKey]"
														:itemCountMax="trackerItemConfigs.max"
														:initial="trackerItemConfigs.initial" />
												</template>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-if="grid_item.i == 'prologue'">
								<h2>Prologue</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.prologue" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'chapter1'">
								<h2>Chapter 1</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter1" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'chapter2'">
								<h2>Chapter 2</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter2" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'chapter3'">
								<h2>Chapter 3</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter3" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'chapter4'">
								<h2>Chapter 4</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter4" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'chapter5'">
								<h2>Chapter 5</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter5" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'chapter6'">
								<h2>Chapter 6</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter6" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'chapter7'">
								<h2>Chapter 7</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter7" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'chapter8'">
								<h2>Chapter 8</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.chapter8" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'other'">
								<h2>Other Items</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.items.other" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items['items'][grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`items/${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'letters'">
								<h2>Letters</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(chaptersItems, chapter) in tracker.items.letters" :key="chapter">
										<template v-for="(trackerItemConfigs, trackerItemKey) in chaptersItems" :key="trackerItemKey">
											<Item
												v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items[grid_item.i][chapter][trackerItemKey]"
												@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs, grid_item.i)"
												@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs, grid_item.i)"
												:itemName="trackerItemConfigs.name"
												:itemKey="trackerItemKey"
												:imageFolder="`${grid_item.i}`"
												:itemCount="save.data.items.letters[trackerItemKey]"
												:itemCountMax="trackerItemConfigs.max"
												:initial="trackerItemConfigs.initial"
												:tooltipDelay="0" />
										</template>
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'misc'">
								<h2>Misc</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.misc" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items[grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`${grid_item.i}`"
											:itemCount="save.data.items[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'koopa_koot_favors'">
								<h2>Koopa Koot Favors</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.koopa_koot_favors" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items[grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs, grid_item.i)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs, grid_item.i)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`${grid_item.i}`"
											:itemCount="save.data.items.koopa_koot_favors[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'trading_event_toad'">
								<h2>Trading Event Toad</h2>
								<div class="flex flex-wrap mt-3 gap-x-0.5 gap-y-2">
									<template v-for="(trackerItemConfigs, trackerItemKey) in tracker.items.trading_event_toad" :key="trackerItemKey">
										<Item
											v-if="trackerItemConfigs.enabled && !save.data.configs.invisible_items[grid_item.i][trackerItemKey]"
											@click="trackerLeftClick($event, trackerItemKey, trackerItemConfigs, grid_item.i)"
											@contextmenu="trackerRightClick($event, trackerItemKey, trackerItemConfigs, grid_item.i)"
											:itemName="trackerItemConfigs.name"
											:itemKey="trackerItemKey"
											:imageFolder="`${grid_item.i}`"
											:itemCount="save.data.items.trading_event_toad[trackerItemKey]"
											:itemCountMax="trackerItemConfigs.max"
											:initial="trackerItemConfigs.initial" />
									</template>
								</div>
							</template>
							<template v-if="grid_item.i == 'map'">
								<div class="flex justify-between mb-3">
									<h2>Map</h2>
									<p>Total checks: {{ logic.getTotalCheckedChecksOnMap() }} / {{ logic.getTotalChecksOnMap() }}</p>
								</div>

								<!-- Map colors: Nothing: bg-slate-600 hover:bg-slate-500 | Available: bg-green-800 hover:bg-green-700 | Unavailable: bg-red-900 hover:bg-red-800 | Selected: bg-sky-600 -->
								<div class="flex flex-wrap items-center justify-center gap-1">
									<div
										class="border-2 border-black rounded-md px-2"
										:class="[map.getMapColorClasses(mapCategoryKey)]"
										v-for="(mapCategoryConfigs, mapCategoryKey) in logic.checks"
										:key="mapCategoryKey"
										@click="map.selectMapCategory(mapCategoryKey)">
										<p class="text-center" :class="[save.data.configs.tracker.map_text_size == undefined ? 'text-base' : `text-${save.data.configs.tracker.map_text_size}`]">
											{{ mapCategoryConfigs.name }}
										</p>
									</div>
								</div>
								<div class="bg-white h-[1px] my-4" />
								<div class="flex justify-between mb-3">
									<h3>{{ logic.checks[map.currentMapCategory].name }}</h3>
									<p>Checks: {{ logic.getTotalCheckedChecksOnMap(map.currentMapCategory) }} / {{ logic.getTotalChecksOnMap(map.currentMapCategory) }}</p>
								</div>

								<div
									class="grid grid-flow-col gap-0.5"
									:class="[`grid-cols-${map.getHighestXForMap(map.currentMapCategory)}`, `grid-rows-${map.getHighestYForMap(map.currentMapCategory)}`]">
									<template v-for="y in map.getHighestYForMap(map.currentMapCategory)">
										<template v-for="x in map.getHighestXForMap(map.currentMapCategory)">
											<div
												v-if="map.getMapByCoordinates(map.currentMapCategory, x, y) !== null"
												class="flex items-center justify-center rounded-md px-1.5 py-0.5"
												:class="[
													map.getMapColorClasses(map.currentMapCategory, map.getMapByCoordinates(map.currentMapCategory, x, y).key),
													`col-start-${x}`,
													`col-span-${map.getMapByCoordinates(map.currentMapCategory, x, y).w}`,
													`row-start-${y}`,
													`row-span-${map.getMapByCoordinates(map.currentMapCategory, x, y).h}`,
													{
														'border-2 border-black': !map.getMapByCoordinates(map.currentMapCategory, x, y).transparent
													}
												]"
												@click="map.selectMap(map.getMapByCoordinates(map.currentMapCategory, x, y).key)">
												<p
													class="text-center"
													:class="[save.data.configs.tracker.map_text_size == undefined ? 'text-base' : `text-${save.data.configs.tracker.map_text_size}`]"
													v-html="map.getMapByCoordinates(map.currentMapCategory, x, y).name" />
											</div>
										</template>
									</template>
								</div>
								<div v-if="map.currentMapCategory && map.currentMap" class="bg-white h-[1px] my-4" />
								<div v-if="map.currentMapCategory && map.currentMap">
									<h2>{{ logic.checks[map.currentMapCategory].maps[map.currentMap].name }}</h2>
									<div class="flex flex-wrap gap-2 mt-3">
										<template v-for="(check, checkKey) in logic.checks[map.currentMapCategory].maps[map.currentMap].checks">
											<div
												v-if="check.exists()"
												class="flex items-center border-2 border-black rounded-md px-2 py-1 cursor-pointer"
												:class="[map.getCheckColorClasses(map.currentMapCategory, map.currentMap, checkKey, check)]"
												@click="map.selectCheck(map.currentMapCategory, map.currentMap, checkKey)"
												@contextmenu="map.unselectCheck(map.currentMapCategory, map.currentMap, checkKey)"
												v-tooltip="check.tooltip !== undefined ? check.tooltip : null">
												<img
													v-if="check.icon"
													class="h-3 mr-2"
													:src="`/images/checks/${check.icon}.webp`"
													v-tooltip="{ content: check.icon.titlize().capitalize(), delay: { show: 200 } }" />
												<p :class="[save.data.configs.tracker.map_text_size == undefined ? 'text-base' : `text-${save.data.configs.tracker.map_text_size}`]">
													{{ check.name }}
												</p>
											</div>
										</template>
									</div>
								</div>
							</template>
						</div>
					</GridItem>
				</template>
			</GridLayout>
		</div>

		<!-- New randomizer seed modal -->
		<Modal :show="loadNewSeedModal" @onClose="loadNewSeedModal = false">
			<div class="flex justify-between w-30">
				<p class="capitalize">Randomizer seed</p>
				<input class="rounded-md" type="number" v-model="save.data.randomizer_seed" />
			</div>
			<button class="border-2 border-sky-800 bg-sky-900 rounded-md p-1 w-full mt-8" @click="save.loadSeed">
				<font-awesome-icon :icon="['fas', 'trash']" />
				Load seed
			</button>
			<div class="bg-white h-[1px] my-4" />
			<div
				class="flex justify-between w-30"
				:class="{
					'mb-3': configIndex < Object.keys(tracker.configs.randomizer).length - 1,
					disabled: !configConfigs.enabled
				}"
				v-for="(configConfigs, config, configIndex) in tracker.configs.randomizer"
				:key="config">
				<p class="capitalize">{{ config.titlize() }}</p>
				<div class="flex" v-if="configConfigs.type == 'switch'">
					<input :id="`config_${config}`" type="checkbox" v-model="save.data.configs.randomizer[config]" />
					<label :for="`config_${config}`" />
				</div>
				<select :id="`config_${config}`" class="rounded-md" v-if="configConfigs.type == 'select'" v-model="save.data.configs.randomizer[config]">
					<option v-for="(option, optionIndex) in configConfigs.options" :key="optionIndex" :value="option.value">
						{{ option.text }}
					</option>
				</select>
				<input
					:id="`config_${config}`"
					class="rounded-md"
					type="number"
					v-if="configConfigs.type == 'number'"
					:min="configConfigs.min"
					:max="configConfigs.max"
					v-model="save.data.configs.randomizer[config]" />
			</div>
			<div class="bg-white h-[1px] my-4" />
			<div
				class="flex justify-between w-30"
				:class="{
					'mb-3': configIndex < Object.keys(tracker.configs.logic).length - 1,
					disabled: !configValue.enabled
				}"
				v-for="(configValue, config, configIndex) in tracker.configs.logic"
				:key="config">
				<p class="capitalize">{{ config.titlize() }}</p>
				<div class="flex" v-if="configValue.type == 'switch'">
					<input :id="`config_${config}`" type="checkbox" v-model="save.data.configs.logic[config]" />
					<label :for="`config_${config}`" />
				</div>
				<select :id="`config_${config}`" class="rounded-md" v-if="configValue.type == 'select'" v-model="save.data.configs.logic[config]">
					<option v-for="(option, optionIndex) in configValue.options" :key="optionIndex" :value="option.value">
						{{ option.text }}
					</option>
				</select>
				<input
					:id="`config_${config}`"
					class="rounded-md"
					type="number"
					v-if="configValue.type == 'number'"
					:min="configValue.min"
					:max="configValue.max"
					v-model="save.data.configs.logic[config]" />
			</div>
		</Modal>

		<!-- Randomizer Modal -->
		<Modal :show="randomizerSettingsModalVisible" @onClose="randomizerSettingsModalVisible = false">
			<div
				class="flex justify-between w-30"
				:class="{
					'mb-3': configIndex < Object.keys(tracker.configs.randomizer).length - 1,
					disabled: !configConfigs.enabled
				}"
				v-for="(configConfigs, config, configIndex) in tracker.configs.randomizer"
				:key="config">
				<p class="capitalize">{{ config.titlize() }}</p>
				<div class="flex" v-if="configConfigs.type == 'switch'">
					<input :id="`config_${config}`" type="checkbox" v-model="save.data.configs.randomizer[config]" />
					<label :for="`config_${config}`" />
				</div>
				<select :id="`config_${config}`" class="rounded-md" v-if="configConfigs.type == 'select'" v-model="save.data.configs.randomizer[config]">
					<option v-for="(option, optionIndex) in configConfigs.options" :key="optionIndex" :value="option.value">
						{{ option.text }}
					</option>
				</select>
				<input
					:id="`config_${config}`"
					class="rounded-md"
					type="number"
					v-if="configConfigs.type == 'number'"
					:min="configConfigs.min"
					:max="configConfigs.max"
					v-model="save.data.configs.randomizer[config]" />
			</div>
		</Modal>

		<!-- Logic Settings Modal -->
		<Modal :show="logicSettingsModalVisible" @onClose="logicSettingsModalVisible = false">
			<div
				class="flex justify-between w-30"
				:class="{
					'mb-3': configIndex < Object.keys(tracker.configs.logic).length - 1,
					disabled: !configValue.enabled
				}"
				v-for="(configValue, config, configIndex) in tracker.configs.logic"
				:key="config">
				<p class="capitalize">{{ config.titlize() }}</p>
				<div class="flex" v-if="configValue.type == 'switch'">
					<input :id="`config_${config}`" type="checkbox" v-model="save.data.configs.logic[config]" />
					<label :for="`config_${config}`" />
				</div>
				<select :id="`config_${config}`" class="rounded-md" v-if="configValue.type == 'select'" v-model="save.data.configs.logic[config]">
					<option v-for="(option, optionIndex) in configValue.options" :key="optionIndex" :value="option.value">
						{{ option.text }}
					</option>
				</select>
				<input
					:id="`config_${config}`"
					class="rounded-md"
					type="number"
					v-if="configValue.type == 'number'"
					:min="configValue.min"
					:max="configValue.max"
					v-model="save.data.configs.logic[config]" />
			</div>
		</Modal>

		<!-- Tracker Modal -->
		<Modal :show="trackerSettingsModalVisible" @onClose="trackerSettingsModalVisible = false">
			<div
				class="flex justify-between w-30"
				:class="{
					'mb-3': configIndex < Object.keys(tracker.configs.tracker).length - 1,
					disabled: !configValue.enabled
				}"
				v-for="(configValue, config, configIndex) in tracker.configs.tracker"
				:key="config">
				<p class="capitalize">{{ config.titlize() }}</p>
				<div class="flex" v-if="configValue.type == 'switch'">
					<input :id="`config_${config}`" type="checkbox" v-model="save.data.configs.tracker[config]" />
					<label :for="`config_${config}`"></label>
				</div>
				<select :id="`config_${config}`" class="rounded-md" v-if="configValue.type == 'select'" v-model="save.data.configs.tracker[config]">
					<option v-for="(option, optionIndex) in configValue.options" :key="optionIndex" :value="option.value">
						{{ option.text }}
					</option>
				</select>
				<input
					:id="`config_${config}`"
					class="rounded-md"
					type="number"
					v-if="configValue.type == 'number'"
					:min="configValue.min"
					:max="configValue.max"
					v-model="save.data.configs.tracker[config]" />
				<input :id="`config_${config}`" class="rounded-md" type="text" v-if="configValue.type == 'text'" v-model="save.data.configs.tracker[config]" />
			</div>
			<div class="bg-white h-[1px] my-4" />
			<button
				class="border-2 border-sky-800 bg-sky-900 rounded-md p-1 w-full"
				@click="
					layout.restoreDefaultLayout();
					trackerSettingsModalVisible = false;
				">
				<font-awesome-icon :icon="['fas', 'trash']" />
				Reset tracker layout
			</button>
		</Modal>

		<!-- Disable Items Modal -->
		<!-- :class="{
					'mb-3': itemIndex < Object.keys(tracker.items.stars).length - 1
				}" -->
		<Modal :show="disableItemsModalVisible" @onClose="disableItemsModalVisible = false">
			<template v-for="(itemCategoryItems, itemCategoryKey, itemCategoryIndex) in tracker.items">
				<div v-if="itemCategoryIndex > 0" class="bg-white h-[1px] my-4" />
				<h2 class="mb-3 capitalize">{{ itemCategoryKey.titlize() }}</h2>
				<div v-if="itemCategoryKey != 'items' && itemCategoryKey != 'letters'" class="flex justify-between w-30 mb-3" v-for="(itemConfigs, item) in itemCategoryItems" :key="item">
					<p v-if="itemCategoryKey == 'equipments'" class="capitalize">{{ itemConfigs.name[0] }}</p>
					<p v-else class="capitalize">{{ itemConfigs.name }}</p>
					<div class="flex">
						<input :id="`disable_items_${item}`" type="checkbox" v-model="save.data.configs.invisible_items[itemCategoryKey][item]" />
						<label :for="`disable_items_${item}`" />
					</div>
				</div>
				<template v-else v-for="(itemSubcategoryItems, itemSubcategoryKey) in itemCategoryItems">
					<div class="flex justify-between w-30 mb-3" v-for="(itemConfigs, item) in itemSubcategoryItems" :key="item">
						<p class="capitalize">{{ itemConfigs.name }}</p>
						<div class="flex">
							<input :id="`disable_items_${item}`" type="checkbox" v-model="save.data.configs.invisible_items[itemCategoryKey][itemSubcategoryKey][item]" />
							<label :for="`disable_items_${item}`" />
						</div>
					</div>
				</template>
			</template>
		</Modal>
	</div>
</template>

<script setup>
import { ref } from 'vue';

import { useSaveStore } from '../stores/save';
import { useTrackerStore } from '../stores/tracker';
import { useLayoutStore } from '../stores/layout';
import { useLogicStore } from '../stores/logic';
import { useMapStore } from '../stores/map';

import Modal from './Modal.vue';
import Item from './tracker/Item.vue';

const save = useSaveStore();
const tracker = useTrackerStore();
const layout = useLayoutStore();
const logic = useLogicStore();
const map = useMapStore();

const loadNewSeedModal = ref(false);
const randomizerSettingsModalVisible = ref(false);
const logicSettingsModalVisible = ref(false);
const trackerSettingsModalVisible = ref(false);
const disableItemsModalVisible = ref(false);

const _importSaveFileInput = ref(null);

const trackerLeftClick = (event, key, configs, itemSubCategory = null) => {
	if (event.ctrlKey) {
		if (key == 'eldstar' || key == 'mamar' || key == 'skolar' || key == 'muskular' || key == 'misstar' || key == 'klevar' || key == 'kalmar') {
			if (save.data.items[`${key}_difficulty`] == undefined) {
				save.data.items[`${key}_difficulty`] = 0;
			}

			if (save.data.items[`${key}_difficulty`] >= 8) {
				save.data.items[`${key}_difficulty`] = 0;
			} else {
				save.data.items[`${key}_difficulty`]++;
			}
		}
		if (key == 'goombario' || key == 'kooper' || key == 'bombette' || key == 'parakarry' || key == 'bow' || key == 'watt' || key == 'sushie' || key == 'lakilester') {
			if (save.data.items[`${key}_rank`] == undefined) {
				save.data.items[`${key}_rank`] = 0;
			}

			if (save.data.items[`${key}_rank`] >= 2) {
				save.data.items[`${key}_rank`] = 0;
			} else {
				save.data.items[`${key}_rank`]++;
			}
		}
	} else if (event.shiftKey) {
		if (key == 'eldstar' || key == 'mamar' || key == 'skolar' || key == 'muskular' || key == 'misstar' || key == 'klevar' || key == 'kalmar') {
			if (save.data.items[`${key}_dungeon_shuffle`] == undefined) {
				save.data.items[`${key}_dungeon_shuffle`] = 0;
			}

			if (save.data.items[`${key}_dungeon_shuffle`] >= 7) {
				save.data.items[`${key}_dungeon_shuffle`] = 0;
			} else {
				save.data.items[`${key}_dungeon_shuffle`]++;
			}
		}
	} else {
		if (configs.max == 1) {
			if (itemSubCategory === null) {
				if (save.data.items[key]) {
					if (save.data.configs.tracker.competitive_mode) {
						save.data.items[key] = false;
					}
				} else {
					save.data.items[key] = true;
				}
			} else {
				if (save.data.items[itemSubCategory][key]) {
					if (save.data.configs.tracker.competitive_mode) {
						save.data.items[itemSubCategory][key] = false;
					}
				} else {
					save.data.items[itemSubCategory][key] = true;
				}
			}
		} else if (configs.max > 1) {
			if (itemSubCategory === null) {
				if (save.data.items[key] < configs.max) {
					save.data.items[key]++;
				} else {
					if (save.data.configs.tracker.competitive_mode) {
						save.data.items[key] = 0;
					}
				}
			} else {
				if (save.data.items[itemSubCategory][key] < configs.max) {
					save.data.items[itemSubCategory][key]++;
				} else {
					if (save.data.configs.tracker.competitive_mode) {
						save.data.items[itemSubCategory][key] = 0;
					}
				}
			}
		} else {
			console.log('Error: Max value is not a number');
		}
	}
};

const trackerRightClick = (event, key, configs, itemSubCategory = null) => {
	if (save.data.configs.tracker.competitive_mode) {
		if (key == 'eldstar' || key == 'mamar' || key == 'skolar' || key == 'muskular' || key == 'misstar' || key == 'klevar' || key == 'kalmar') {
			if (event.buttons == 1) {
				if (save.data.items[`${key}_dungeon_shuffle`] == undefined) {
					save.data.items[`${key}_dungeon_shuffle`] = 0;
				}

				if (save.data.items[`${key}_dungeon_shuffle`] >= 7) {
					save.data.items[`${key}_dungeon_shuffle`] = 0;
				} else {
					save.data.items[`${key}_dungeon_shuffle`]++;
				}
			} else {
				if (save.data.items[`${key}_difficulty`] == undefined) {
					save.data.items[`${key}_difficulty`] = 0;
				}

				if (save.data.items[`${key}_difficulty`] >= 8) {
					save.data.items[`${key}_difficulty`] = 0;
				} else {
					save.data.items[`${key}_difficulty`]++;
				}
			}
		} else if (key == 'goombario' || key == 'kooper' || key == 'bombette' || key == 'parakarry' || key == 'bow' || key == 'watt' || key == 'sushie' || key == 'lakilester') {
			if (save.data.items[`${key}_rank`] == undefined) {
				save.data.items[`${key}_rank`] = 0;
			}

			if (save.data.items[`${key}_rank`] >= 2) {
				save.data.items[`${key}_rank`] = 0;
			} else {
				save.data.items[`${key}_rank`]++;
			}
		} else {
			if (save.data.items.hand_ins === undefined) {
				save.data.items.hand_ins = {};
			}
			if (itemSubCategory === null) {
				if (save.data.items.hand_ins[key] == undefined) {
					save.data.items.hand_ins[key] = 0;
				}

				if (save.data.items.hand_ins[key] >= configs.max) {
					save.data.items.hand_ins[key] = 0;
				} else {
					save.data.items.hand_ins[key]++;
				}
			} else {
				if (save.data.items.hand_ins[itemSubCategory] == undefined) {
					save.data.items.hand_ins[itemSubCategory] = {};
				}
				if (save.data.items.hand_ins[itemSubCategory][key] == undefined) {
					save.data.items.hand_ins[itemSubCategory][key] = 0;
				}

				if (save.data.items.hand_ins[itemSubCategory][key] >= configs.max) {
					save.data.items.hand_ins[itemSubCategory][key] = 0;
				} else {
					save.data.items.hand_ins[itemSubCategory][key]++;
				}
			}
		}
	} else {
		if (event.ctrlKey) {
			if (key == 'eldstar' || key == 'mamar' || key == 'skolar' || key == 'muskular' || key == 'misstar' || key == 'klevar' || key == 'kalmar') {
				if (save.data.items[`${key}_difficulty`] == undefined) {
					save.data.items[`${key}_difficulty`] = 0;
				}

				if (save.data.items[`${key}_difficulty`] <= 0) {
					save.data.items[`${key}_difficulty`] = 8;
				} else {
					save.data.items[`${key}_difficulty`]--;
				}
			}
			if (key == 'goombario' || key == 'kooper' || key == 'bombette' || key == 'parakarry' || key == 'bow' || key == 'watt' || key == 'sushie' || key == 'lakilester') {
				if (save.data.items[`${key}_rank`] == undefined) {
					save.data.items[`${key}_rank`] = 0;
				}

				if (save.data.items[`${key}_rank`] <= 0) {
					save.data.items[`${key}_rank`] = 2;
				} else {
					save.data.items[`${key}_rank`]--;
				}
			}
		} else {
			if (configs.max == 1) {
				if (itemSubCategory === null) {
					if (save.data.items[key] !== undefined) {
						save.data.items[key] = false;
					}
				} else {
					if (save.data.items[itemSubCategory][key] !== undefined) {
						save.data.items[itemSubCategory][key] = false;
					}
				}
			} else if (configs.max > 1) {
				if (itemSubCategory === null) {
					if (save.data.items[key] > 0) {
						save.data.items[key]--;
					}
				} else {
					if (save.data.items[itemSubCategory][key] > 0) {
						save.data.items[itemSubCategory][key]--;
					}
				}
			} else {
				console.log('Error: Max value is not a number');
			}
		}
	}
};

const resetSavePrompt = () => {
	if (confirm('Are you sure you want to reset your save? This will reset only your tracker progression, not your configs.')) {
		save.resetSave();
	}
};

const resetConfigsPrompt = () => {
	if (confirm('Are you sure you want to reset your configs? This will reset only your configs, not your tracker progression.')) {
		save.resetConfigs();
	}
};

const resetTrackerPrompt = () => {
	if (confirm('Are you sure you want to reset your tracker settings? It will not reset any progression, logic or tracker layout configs.')) {
		save.resetTrackerConfigs();
	}
};

const resetLayoutPrompt = () => {
	if (confirm('Are you sure you want to reset your tracker layout? It will revert to the default layout. It will not reset any progression, logic or tracker configs.')) {
		save.resetTrackerLayout = true;
	}
};

//OnLoad Function Calls
layout.loadLayout();
save.loadSave();
save.initInvisibleItems();
</script>
